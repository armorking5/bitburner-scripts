/* eslint-disable @typescript-eslint/no-unused-vars */
import { NS } from '@ns';

/** @param {NS} ns **/
export async function main(ns: NS): Promise<void> {

	let argumentServer = 'home';
	let scriptToRun = '';
	if (ns.args.length > 0) {
		scriptToRun = typeof ns.args[0] === 'string' ? ns.args[0] : (typeof ns.args[0] === 'boolean' ? 'NaN' : ns.args[0].toString(10));
		if (ns.args.length > 1) {
			argumentServer = typeof ns.args[1] === 'string' ? ns.args[1] : (typeof ns.args[1] === 'boolean' ? 'NaN' : ns.args[1].toString(10));
		}
	} else {
		return ns.alert('No script available');
	}

	// Get potential servers connected to this one (only know-how to find new servers)
	const potentialServers = ns.scan();
	for (const server of potentialServers) {

		ns.print('Server is ' + server);

		// if it has root access => copy me and early-hack script and spawn another me on that server
		if (ns.hasRootAccess(server)) {

			ns.print('Copying to ' + server);
			await ns.scp([scriptToRun, '/scripts/spawner.js'], server);
			ns.exec('/scripts/spawner.js', server, 1, scriptToRun, server);

		}

		ns.print('Sleeping');
		await ns.sleep(5000);
	}

	if (!ns.isRunning(scriptToRun, argumentServer)) {
		await ns.exec(scriptToRun, argumentServer, 1, argumentServer);
	}
}