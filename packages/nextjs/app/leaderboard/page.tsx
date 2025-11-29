"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const LeaderboardPage: NextPage = () => {
    const { address: connectedAddress } = useAccount();

    // Mock Data for Leaderboard
    const leaderboardData = [
        { rank: 1, address: "0x1234567890123456789012345678901234567890", cleanups: 42, votes: 156, rewards: "25.5 MON" },
        { rank: 2, address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", cleanups: 38, votes: 120, rewards: "18.2 MON" },
        { rank: 3, address: "0x9876543210987654321098765432109876543210", cleanups: 31, votes: 98, rewards: "15.0 MON" },
        { rank: 4, address: "0x1111222233334444555566667777888899990000", cleanups: 25, votes: 85, rewards: "12.5 MON" },
        { rank: 5, address: "0xaaaabbbbccccddddeeeeffff0000111122223333", cleanups: 18, votes: 60, rewards: "8.0 MON" },
    ];

    return (
        <div className="flex items-center flex-col flex-grow pt-10">
            <div className="px-5 w-full max-w-4xl">
                <h1 className="text-center mb-8">
                    <span className="block text-4xl font-bold text-base-content">CleanFi Leaderboard</span>
                    <span className="block text-xl mb-2 text-primary">Top Planet Savers 🌍</span>
                </h1>

                <div className="overflow-x-auto bg-base-100 shadow-xl rounded-2xl border border-base-300">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-base-200 text-base-content/70">
                                <th className="text-center">Rank</th>
                                <th>User</th>
                                <th className="text-center">Cleanups Verified</th>
                                <th className="text-center">Votes Cast</th>
                                <th className="text-center">Rewards Earned</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboardData.map((user) => (
                                <tr key={user.rank} className="hover:bg-base-200/50 transition-colors">
                                    <th className="text-center text-xl">
                                        {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : user.rank}
                                    </th>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                                                    <span className="text-xs">{user.address.substring(2, 4)}</span>
                                                </div>
                                            </div>
                                            <Address address={user.address} size="sm" />
                                        </div>
                                    </td>
                                    <td className="text-center font-bold text-primary">{user.cleanups}</td>
                                    <td className="text-center">{user.votes}</td>
                                    <td className="text-center font-bold text-secondary">{user.rewards}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {connectedAddress && (
                    <div className="mt-8 text-center">
                        <div className="stats shadow bg-base-100 border border-base-300">
                            <div className="stat">
                                <div className="stat-title">Your Rank</div>
                                <div className="stat-value text-primary">#12</div>
                                <div className="stat-desc">Top 15%</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Your Cleanups</div>
                                <div className="stat-value text-secondary">8</div>
                                <div className="stat-desc">2 pending verification</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Earned</div>
                                <div className="stat-value text-accent">3.2 MON</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
