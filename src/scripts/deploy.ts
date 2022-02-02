import { NS } from '@ns';

/** @param {NS} ns **/
export async function main(ns: NS): Promise<void> {
	const args = ns.flags([["help", false], ["max", false]]);
	if (args.help || args._.length < 2) {
		ns.tprint("This script deploys another script on a server");
		ns.tprint("Use --max if you want to use with maximum threads possible.");
		ns.tprint(`Usage: run ${ns.getScriptName()} HOST SCRIPT ARGUMENTS`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()} n00dles basic_hack.js foodnstuff`);
		return;
	}

	const host = args._[0];
	const script = args._[1];
	const script_args = args._.slice(2);

	if (!ns.serverExists(host)) {
		ns.tprint(`Server '${host}' does not exist. Aborting.`);
		return;
	}
	if (!ns.ls(ns.getHostname()).find(f => f === script)) {
		ns.tprint(`Script '${script}' does not exist. Aborting.`);
		return;
	}

	let threads = 0;
	if (args.max) {
		threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(script));
	} else {
		threads = 1;
	}

	ns.tprint(`Launching script '${script}' on server '${host}' with ${threads} threads and the following arguments: ${script_args}`);
	await ns.scp(script, ns.getHostname(), host);
	ns.exec(script, host, threads, ...script_args);
}