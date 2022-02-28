/* eslint-disable @typescript-eslint/no-unused-vars */
import { NS } from '@ns';

/** @param {NS} ns **/
export async function main(ns: NS): Promise<void> {

	let argumentServer = 'home';
	if (ns.args.length > 0) {
		argumentServer = typeof ns.args[0] === 'string' ? ns.args[0] : (typeof ns.args[0] === 'boolean' ? 'NaN' : ns.args[0].toString(10));
	}

	// Get potential servers connected to this one (only know-how to find new servers)
	const potentialServers = ns.scan(argumentServer);
	for (const server of potentialServers) {

		ns.print('Server is ' + server);

		// if it has root access => copy me and early-hack script and spawn another me on that server
		let script = '';
		let toRun = '';
		if (ns.hasRootAccess(server)) {

			ns.print('Copying to ' + server);
			await ns.scp([
				'/hacks/early-hack.js',
				'/hacks/soft-hack.js'
			], server);
			script = '/hacks/soft-hack.js';
			toRun = server;

			// no root access? Let's try and hack that server
		} else {

			ns.print('Hacking ' + server);
			script = '/hacks/early-hack.js';
			toRun = argumentServer;

		}

		await ns.exec(script, toRun, 1, server);

		ns.print('Sleeping');
		await ns.sleep(5000);
	}

	ns.spawn('/hacks/early-hack.js', 1, argumentServer);

}