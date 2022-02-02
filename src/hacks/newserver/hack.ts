import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {
	const server = typeof ns.args[0] === 'string' ? ns.args[0] : (typeof ns.args[0] === 'boolean' ? 'NaN' : ns.args[0].toString(10));
	const sleeptime = typeof ns.args[0] === 'string' ? parseInt(ns.args[0], 10) : (typeof ns.args[0] === 'boolean' ? 0 : ns.args[0]);
	await ns.sleep(sleeptime);
	await ns.hack(server);
}