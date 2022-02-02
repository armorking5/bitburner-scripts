/* eslint-disable no-var */
import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {

	const server = typeof ns.args[0] === 'string' ? ns.args[0] : (typeof ns.args[0] === 'boolean' ? 'NaN' : ns.args[0].toString(10));   //Host to hack
	const server2 = ns.getHostname(); //Server to run scripts on
	let i = 0;
	let c = 0;
	let player = ns.getPlayer();
	let fserver = ns.getServer(server);
	const contstantRam = ns.getScriptRam("/newserver/OP.ns"); //grabbing script RAM values
	const hackscriptRam = ns.getScriptRam("/newserver/hack.js");
	const growscriptRam = ns.getScriptRam("/newserver/grow.js");
	const weakenscriptRam = ns.getScriptRam("/newserver/weaken.js");
	const maxRam = (ns.getServerMaxRam(server2) - contstantRam); //getting total RAM I can use that doesnt include the OP script
	let weakenThreads = (2000 - ((ns.getServerMinSecurityLevel(server)) / 0.05));
	const maxGrowThreads = ((maxRam / growscriptRam) - (weakenscriptRam * 2000));
	let cs = ns.getServerSecurityLevel(server);
	let ms = ns.getServerMinSecurityLevel(server);
	let mm = ns.getServerMaxMoney(server);
	let ma = ns.getServerMoneyAvailable(server);



	//Priming the server.  Max money and Min security must be acheived for this to work
	if ((ma < mm) == true) {
		ns.exec('/newserver/weaken.js', server2, 2000, server, 0);
		ns.exec('/newserver/grow.js', server2, maxGrowThreads, server, 0);
		var WeakenTime = (ns.formulas.hacking.weakenTime(fserver, player));
		await ns.sleep(WeakenTime + 1000);
		mm = ns.getServerMaxMoney(server);
		ma = ns.getServerMoneyAvailable(server);
		player = ns.getPlayer();
		fserver = ns.getServer(server);
		cs = ns.getServerSecurityLevel(server);
		ms = ns.getServerMinSecurityLevel(server);

	}


	//If Max Money is true, making sure security level is at its minimum
	if ((cs > ms) == true) {

		ns.exec('/newserver/weaken.js', server2, 2000, server, 0);
		WeakenTime = (ns.formulas.hacking.weakenTime(fserver, player));
		await ns.sleep(WeakenTime + 1000);
		cs = ns.getServerSecurityLevel(server);
		ms = ns.getServerMinSecurityLevel(server);

	}

	//Refreshing server stats now that the security level is at the minmum, and maybe our player stats have changed as priming can take a while
	player = ns.getPlayer();
	fserver = ns.getServer(server);

	const HPercent = (ns.formulas.hacking.hackPercent(fserver, player) * 100);
	const GPercent = (ns.formulas.hacking.growPercent(fserver, 1, player, 1));
	WeakenTime = (ns.formulas.hacking.weakenTime(fserver, player));
	const GrowTime = (ns.formulas.hacking.growTime(fserver, player));
	const HackTime = (ns.formulas.hacking.hackTime(fserver, player));

	const growThreads = Math.round(((5 / (GPercent - 1)))); //Getting the amount of threads I need to grow 200%.  I only need 100% but I'm being conservative here
	const hackThreads = Math.round((50 / HPercent));  //Getting the amount of threads I need to hack 50% of the funds
	weakenThreads = Math.round((weakenThreads - (growThreads * 0.004))); //Getting required threads to fully weaken the server

	const totalRamForRun = (hackscriptRam * hackThreads) + (growscriptRam * growThreads) + (weakenscriptRam * weakenThreads) //Calculating how much RAM is used for a single run
	const sleepTime = (WeakenTime / (maxRam / totalRamForRun)) //finding how many runs this server can handle and setting the time between run execution

	//if (sleepTime<500) // Testing forcing a min sleep time of 500 ms
	//{sleepTime = 500;
	//}

	const shiftCount = maxRam / totalRamForRun;
	const offset = sleepTime / 2
	const gOffset = offset / 4
	const hOffset = offset / 2


	while (true) {
		const wsleep = 0; //At one point I made the weaken call sleep so I've kept it around
		const gsleep = ((WeakenTime - GrowTime - gOffset)); //Getting the time to have the Growth execution sleep, then shaving some off to beat the weaken execution
		const hsleep = ((WeakenTime - HackTime - hOffset)); //Getting time for hack, shaving off more to make sure it beats both weaken and growth
		const UsedRam = ns.getServerUsedRam(server2);


		if ((totalRamForRun >= (maxRam - UsedRam)) == false) //making sure I have enough RAM to do a full run
		{
			ns.exec('/newserver/weaken.js', server2, weakenThreads, server, wsleep, i);
			ns.exec('/newserver/grow.js', server2, growThreads, server, gsleep, i);
			ns.exec('/newserver/hack.js', server2, hackThreads, server, hsleep, i);

			if (c < shiftCount) {
				await ns.sleep(sleepTime)
				c++
			}
			else {
				await ns.sleep(sleepTime + offset);
				c = 0;
			}


			i++
		}
		else {
			await ns.sleep(1000)
		}
	}
	await ns.sleep(120000)
}