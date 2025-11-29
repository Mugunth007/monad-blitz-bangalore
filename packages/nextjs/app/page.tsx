"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import {
  ChartBarIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  GlobeAmericasIcon,
  PhotoIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="min-h-screen bg-base-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-base-200 to-base-200">
        <div className="flex items-center flex-col grow pt-10 px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-base-content mb-4 drop-shadow-md">
              CleanFi <span className="text-primary">🌍</span>
            </h1>
            <p className="text-xl text-base-content/80 mb-6 max-w-2xl">
              Earn rewards for cleaning the world! Upload proof, get verified by the community, and earn MON & Impact NFTs.
            </p>

            {connectedAddress && (
              <div className="bg-base-100/50 backdrop-blur-sm rounded-lg p-4 inline-block border border-primary/20 shadow-lg">
                <p className="text-base-content/80 text-sm mb-2">Connected Address:</p>
                <Address address={connectedAddress} />
              </div>
            )}
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mb-12">
            {/* Start Cleaning Card */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 border border-primary/30">
              <div className="text-center">
                <PhotoIcon className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-base-content mb-3">Start Cleaning</h3>
                <p className="text-base-content/60 mb-6">
                  Found a dirty spot? Clean it up, take before/after photos, and upload proof.
                </p>
                <Link
                  href="/clean"
                  className="w-full bg-primary text-primary-content font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-300 inline-block shadow-lg shadow-primary/30"
                >
                  📸 Upload Proof
                </Link>
              </div>
            </div>

            {/* Verify Card */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-300 transform hover:scale-105 border border-secondary/30">
              <div className="text-center">
                <CheckBadgeIcon className="w-16 h-16 text-secondary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-base-content mb-3">Verify Cleanups</h3>
                <p className="text-base-content/60 mb-6">
                  Validate community cleanups. Earn a share of rewards for accurate voting.
                </p>
                <Link
                  href="/verify"
                  className="w-full bg-secondary text-secondary-content font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-300 inline-block shadow-lg shadow-secondary/30"
                >
                  ✅ Start Voting
                </Link>
              </div>
            </div>

            {/* Leaderboard Card */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 transform hover:scale-105 border border-accent/30">
              <div className="text-center">
                <GlobeAmericasIcon className="w-16 h-16 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-base-content mb-3">Global Impact</h3>
                <p className="text-base-content/60 mb-6">
                  See top cleaners and verified impact stats. Compete for the top spot!
                </p>
                <Link
                  href="/leaderboard"
                  className="w-full bg-accent text-accent-content font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-300 inline-block shadow-lg shadow-accent/30"
                >
                  🏆 View Leaderboard
                </Link>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl p-8 max-w-4xl w-full mb-12 border border-base-300">
            <h2 className="text-3xl font-bold text-base-content text-center mb-8">🌱 How CleanFi Works</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <PhotoIcon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-base-content mb-2">1. Clean & Snap</h3>
                  <p className="text-base-content/60">
                    Find litter, clean it up, and take clear before/after photos or video.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <UserGroupIcon className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-base-content mb-2">2. Community Verify</h3>
                  <p className="text-base-content/60">
                    The community votes on your proof. Consensus ensures authenticity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CurrencyDollarIcon className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-base-content mb-2">3. Earn Rewards</h3>
                  <p className="text-base-content/60">
                    Get paid in MON and mint a Proof-of-Impact NFT for every validated cleanup.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <ChartBarIcon className="w-8 h-8 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-base-content mb-2">4. Track Impact</h3>
                  <p className="text-base-content/60">
                    Build your on-chain reputation as a planet saver.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
