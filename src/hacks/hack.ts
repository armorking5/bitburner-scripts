/* eslint-disable @typescript-eslint/no-unused-vars */
import { NS, Server } from '@ns';

/** @param {NS} ns **/
export async function main(ns: NS): Promise<void> {
	const hosts = ['hong-fang-tea', 'sigma-cosmetics', 'joesguns', 'nectar-net', 'hong-fang-tea', 'harakiri-sushi', 'neo-net', 'zer0', 'max-hardware', 'iron-gym', 'phantasy', 'silver-helix', 'omega-net', 'crush-fitness', 'the-hub', 'johnson-ortho', 'comptek', 'netlink', 'rothman-uni', 'catalyst', 'summit-uni', 'aevum-police', 'rho-construction', 'millenium-fitness', 'alpha-ent', 'syscore', 'lexo-corp', 'zb-institute', 'snap-fitness', 'global-pharm', 'unitalife', 'galactic-cyber', 'solaris', 'zeus-med', 'aerocorp', 'univ-energy', 'deltaone', 'omnia', 'defcomm', 'icarus', 'zb-def', 'nova-med', 'taiyang-digital', 'infocomm', 'run4theh111z', 'titan-labs', 'microdyne', 'fulcrumtech', 'stormtech', 'kuai-gong', '.', 'b-and-a', 'nwo', 'applied-energetics', 'helios', '4sigma', 'blade', 'clarkinc', 'fulcrumassets', 'vitalife', 'omnitek', 'powerhouse-fitness', 'ecorp', 'megacorp', 'The-Cave', 'w0r1d_d43m0n'];
	const rhosts: string[] = [];
	const orderedHosts = [];
	const orderedMoney = [];
	let Money = 0;
	let i = 0;
	let s = 0;
	let x = 0;
	let v = 0;
	let chmm = 0;
	const f = ns.formulas.hacking;
	const player = ns.getPlayer();
	let fserver: Server | null = null;
	let weakenTime = 0;
	let mps = 0;
	const contstantRam = ns.getScriptRam("/newserver/OP.ns"); //grabbing script RAM values
	const hackscriptRam = ns.getScriptRam("/newserver/hack.js");
	const growscriptRam = ns.getScriptRam("/newserver/grow.js");
	const weakenscriptRam = ns.getScriptRam("/newserver/weaken.js");
	const serverRam = typeof ns.args[0] === 'string' ? parseInt(ns.args[0]) : (typeof ns.args[0] === 'boolean' ? 0 : ns.args[0]);
	let growThreads = 0;
	let hackThreads = 0;
	let HPercent = 0;
	let GPercent = 0;
	let totalRamForRun = 0;
	let runs = 0;

	while (i < hosts.length) {
		if (ns.hasRootAccess(hosts[i]) == false) { i++ }
		else { rhosts.push(hosts[i]); }
		i++
	}

	i = 0;


	while (s < rhosts.length) {
		Money = 0;
		v = 0;
		while (i < rhosts.length) {

			fserver = ns.getServer(rhosts[i]);
			fserver.hackDifficulty = fserver.minDifficulty;
			growThreads = Math.round(((2.3 / (GPercent - 1)))); //Getting the amount of threads I need to grow 200%.  I only need 100% but I'm being conservative here
			hackThreads = Math.round((50 / HPercent));  //Getting the amount of threads I need to hack 50% of the funds
			let weakenThreads = ((2000) - ((ns.getServerMinSecurityLevel(rhosts[i])) / 0.05));
			weakenThreads = Math.round((weakenThreads - (growThreads * 0.004) - (hackThreads * 0.002)));
			HPercent = (f.hackPercent(fserver, player) * 100);
			GPercent = (f.growPercent(fserver, 1, player, 1));

			totalRamForRun = (hackscriptRam * hackThreads) + (growscriptRam * growThreads) + (weakenscriptRam * weakenThreads)
			runs = ns.getServerMaxRam("home") / totalRamForRun
			//Getting required threads to fully weaken the server
			weakenTime = (f.weakenTime(fserver, player) / 1000);

			chmm = ns.getServerMaxMoney(rhosts[i]);
			mps = (chmm / weakenTime) * (serverRam / totalRamForRun);
			chmm = mps;

			if (serverRam < totalRamForRun) { v = 1; }

			const item = orderedHosts.filter(serverExists);
			if (!(item.includes(rhosts[i]) || ns.hasRootAccess(rhosts[i]) == false || v == 1)) {

				if (chmm >= Money) {
					Money = chmm;
					x = i;
				}
			}
			i++;
		}
		orderedMoney.push(Money);
		orderedHosts.push(rhosts[x]);
		s++;
		i = 0;
	}

	ns.print(orderedHosts)

	function serverExists(server: string) {
		return server == rhosts[i];
	}


}