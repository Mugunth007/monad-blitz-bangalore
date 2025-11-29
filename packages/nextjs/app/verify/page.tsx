"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { CheckCircleIcon, XCircleIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { notification } from "~~/utils/scaffold-eth";

const VerifyPage: NextPage = () => {
    const { address: connectedAddress } = useAccount();
    const [currentCleanupId, setCurrentCleanupId] = useState<bigint>(BigInt(1));
    const [exitX, setExitX] = useState<number | null>(null);

    // Animation values
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

    // Read cleanup data from contract
    const { data: cleanup, isLoading: isCleanupLoading } = useScaffoldReadContract({
        contractName: "CleanFi",
        functionName: "cleanups",
        args: [currentCleanupId],
    });

    const { writeContractAsync: vote } = useScaffoldWriteContract("CleanFi");

    const handleVote = async (isUpvote: boolean) => {
        if (!connectedAddress) {
            notification.error("Please connect your wallet to vote");
            return;
        }

        try {
            await vote({
                functionName: "vote",
                args: [currentCleanupId, isUpvote],
                value: BigInt(100000000000000000), // 0.1 MON
            });

            setExitX(isUpvote ? 200 : -200);
            setTimeout(() => {
                setCurrentCleanupId(prev => prev + BigInt(1));
                setExitX(null);
                x.set(0);
            }, 1000);
        } catch (e) {
            console.error("Error voting:", e);
        }
    };

    const onDragEnd = (event: any, info: PanInfo) => {
        if (info.offset.x > 100) {
            handleVote(true);
        } else if (info.offset.x < -100) {
            handleVote(false);
        }
    };

    // Loading state
    if (isCleanupLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    // No more cleanups or invalid data
    if (!cleanup || cleanup[1] === "0x0000000000000000000000000000000000000000") {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">No cleanups to verify</h2>
                    <p className="text-base-content/60">Waiting for new submissions on-chain...</p>
                    <button
                        className="btn btn-primary mt-4"
                        onClick={() => setCurrentCleanupId(BigInt(1))}
                    >
                        Refresh / Check ID 1
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center flex-col flex-grow pt-10 overflow-hidden">
            <h1 className="text-center mb-6">
                <span className="block text-4xl font-bold text-base-content">Verify Cleanups</span>
                <span className="block text-xl mb-2 text-base-content/60">Swipe to validate impact</span>
            </h1>

            <div className="relative w-full max-w-md h-[600px] flex items-center justify-center">
                {/* Card Stack */}
                <motion.div
                    className="absolute w-full px-4"
                    style={{ x, rotate, opacity }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={onDragEnd}
                    animate={exitX !== null ? { x: exitX, opacity: 0 } : { x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="card bg-base-100 shadow-2xl border border-base-300 overflow-hidden select-none">
                        {/* Images Container */}
                        <div className="relative h-80 w-full flex">
                            {/* Note: Contract currently only stores one IPFS hash. 
                  We'll use it for both or assume it's a JSON containing both. 
                  For now, displaying the same image or a placeholder if format is simple string. */}
                            <div className="w-full h-full relative">
                                <img
                                    src={`https://ipfs.io/ipfs/${cleanup[2]}`}
                                    alt="Cleanup Proof"
                                    className="w-full h-full object-cover"
                                    draggable="false"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Invalid+IPFS+Hash";
                                    }}
                                />
                                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                                    ID: {currentCleanupId.toString()}
                                </div>
                            </div>

                            {/* Swipe Indicators */}
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center bg-green-500/30 pointer-events-none"
                                style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
                            >
                                <CheckCircleIcon className="w-32 h-32 text-white drop-shadow-lg" />
                            </motion.div>
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center bg-red-500/30 pointer-events-none"
                                style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
                            >
                                <XCircleIcon className="w-32 h-32 text-white drop-shadow-lg" />
                            </motion.div>
                        </div>

                        <div className="card-body p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="card-title text-2xl">
                                        Cleanup #{currentCleanupId.toString()}
                                    </h2>
                                    <p className="text-sm text-base-content/60 mt-1">
                                        Uploader: {cleanup[1].substring(0, 6)}...{cleanup[1].substring(38)}
                                    </p>
                                </div>
                                <div className="badge badge-primary badge-outline">0.1 MON</div>
                            </div>

                            <div className="flex gap-4 mt-2">
                                <div className="badge badge-success gap-1">
                                    👍 {cleanup[3].toString()}
                                </div>
                                <div className="badge badge-error gap-1">
                                    👎 {cleanup[4].toString()}
                                </div>
                            </div>

                            <div className="flex gap-6 w-full justify-center mt-6">
                                <button
                                    className="btn btn-error btn-circle btn-lg shadow-lg hover:scale-110 transition-transform"
                                    onClick={() => handleVote(false)}
                                >
                                    <XCircleIcon className="w-8 h-8 text-white" />
                                </button>
                                <div className="flex flex-col items-center justify-center text-xs text-base-content/40">
                                    <ArrowsRightLeftIcon className="w-6 h-6 mb-1 animate-pulse" />
                                    <span>Swipe</span>
                                </div>
                                <button
                                    className="btn btn-success btn-circle btn-lg shadow-lg hover:scale-110 transition-transform"
                                    onClick={() => handleVote(true)}
                                >
                                    <CheckCircleIcon className="w-8 h-8 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default VerifyPage;
