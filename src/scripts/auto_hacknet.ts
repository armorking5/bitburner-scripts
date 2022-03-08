import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {
	function myMoney() {
		return ns.getServerMoneyAvailable("home");
	}

	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("sleep");

	const cnt = 16;
	let res = null;

	while (ns.hacknet.numNodes() < cnt) {
		res = ns.hacknet.purchaseNode();
		await ns.sleep(100);
		if (res === -1) {
			ns.print("NODE BUY: Need $" + ns.hacknet.getPurchaseNodeCost() + " . Have $" + myMoney());
			await ns.sleep(3000);
		} else {
			ns.print("Purchased hacknet Node with index " + res);
		}
	}

	for (let i = 0; i < cnt; i++) {
		while (ns.hacknet.getNodeStats(i).level < 200) {
			const cost = ns.hacknet.getLevelUpgradeCost(i, 10);
			while (myMoney() < cost) {
				ns.print("LEVEL BUY: Need $" + cost + " . Have $" + myMoney());
				await ns.sleep(3000);
			}
			res = ns.hacknet.upgradeLevel(i, 10);
			await ns.sleep(100);
			ns.print("Hacknet #" + i + " level upgraded");
		}
	}

	ns.print("All nodes upgraded to level 200");

	for (let i = 0; i < cnt; i++) {
		while (ns.hacknet.getNodeStats(i).ram < 64) {
			const cost = ns.hacknet.getRamUpgradeCost(i, 2);
			while (myMoney() < cost) {
				ns.print("RAM BUY: Need $" + cost + " . Have $" + myMoney());
				await ns.sleep(3000);
			}
			res = ns.hacknet.upgradeRam(i, 2);
			await ns.sleep(100);

			ns.print("Hacknet #" + i + " RAM upgraded");
		}
	}

	ns.print("All nodes upgraded to 64GB RAM");

	for (let i = 0; i < cnt; i++) {
		while (ns.hacknet.getNodeStats(i).cores < 16) {
			const cost = ns.hacknet.getCoreUpgradeCost(i, 1);
			while (myMoney() < cost) {
				ns.print("CORE BUY: Need $" + cost + " . Have $" + myMoney());
				await ns.sleep(3000);
			}
			res = ns.hacknet.upgradeCore(i, 1);
			await ns.sleep(100);

			ns.print("Hacknet #" + i + " core upgraded");
		}
	}

	ns.print("All nodes upgraded to ' + cnt + ' cores");
}