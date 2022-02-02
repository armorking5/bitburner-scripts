import { NS } from '@ns';

function recursiveScan(ns: NS, parent: string, server: string, target: string, route: string[]) {
	const children = ns.scan(server);
	for (const child of children) {
		if (parent == child) {
			continue;
		}
		if (child == target) {
			route.unshift(child);
			route.unshift(server);
			return true;
		}

		if (recursiveScan(ns, server, child, target, route)) {
			route.unshift(server);
			return true;
		}
	}
	return false;
}

export async function main(ns: NS): Promise<void> {
	const args = ns.flags([["help", false]]);
	const route = [];
	const server = typeof args._[0] === 'string' ? args._[0] : (typeof args._[0] === 'boolean' ? 'NaN' : args._[0].toString(10))
	if (!server || args.help) {
		ns.tprint("This script helps you find a server on the network and shows you the path to get to it.");
		ns.tprint(`Usage: run ${ns.getScriptName()} SERVER`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()} n00dles`);
		return;
	}

	recursiveScan(ns, '', 'home', server, route);
	for (const i in route) {
		await ns.sleep(500);
		const extra = i > 0 ? "└ " : "";
		ns.tprint(`${" ".repeat(i)}${extra}${route[i]}`);
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autocomplete(data: , args: string[]): string[] {
	return [...data.servers]
}