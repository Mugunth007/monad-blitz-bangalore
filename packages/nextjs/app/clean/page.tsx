"use client";

import { useRef, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ArrowUpTrayIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const CleanPage: NextPage = () => {
    const { address: connectedAddress } = useAccount();
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [beforeImage, setBeforeImage] = useState<string | null>(null);
    const [afterImage, setAfterImage] = useState<string | null>(null);

    const beforeInputRef = useRef<HTMLInputElement>(null);
    const afterInputRef = useRef<HTMLInputElement>(null);

    const { writeContractAsync: uploadCleanup } = useScaffoldWriteContract("CleanFi");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isBefore: boolean) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isBefore) {
                    setBeforeImage(reader.result as string);
                } else {
                    setAfterImage(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (isBefore: boolean) => {
        if (isBefore) {
            setBeforeImage(null);
            if (beforeInputRef.current) beforeInputRef.current.value = "";
        } else {
            setAfterImage(null);
            if (afterInputRef.current) afterInputRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        if (!description || !beforeImage || !afterImage) return;
        setIsUploading(true);
        try {
            // Mock IPFS upload - in reality, we'd upload files to IPFS here
            const mockIpfsHash = "Qm" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            await uploadCleanup({
                functionName: "uploadCleanup",
                args: [mockIpfsHash],
            });

            setDescription("");
            setBeforeImage(null);
            setAfterImage(null);
            if (beforeInputRef.current) beforeInputRef.current.value = "";
            if (afterInputRef.current) afterInputRef.current.value = "";

        } catch (e) {
            console.error("Error uploading cleanup:", e);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex items-center flex-col flex-grow pt-10">
            <div className="px-5 w-full max-w-xl">
                <h1 className="text-center mb-8">
                    <span className="block text-4xl font-bold text-base-content">Upload Cleanup Proof</span>
                    <span className="block text-2xl mb-2 text-primary">Show the world your impact! 🌍</span>
                </h1>

                <div className="card w-full bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold">Before Photo</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={beforeInputRef}
                                onChange={(e) => handleImageChange(e, true)}
                            />
                            {beforeImage ? (
                                <div className="relative rounded-lg overflow-hidden border-2 border-base-300 h-64">
                                    <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
                                    <button
                                        className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
                                        onClick={() => removeImage(true)}
                                    >
                                        <XMarkIcon className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center cursor-pointer hover:bg-base-200 transition-colors group"
                                    onClick={() => beforeInputRef.current?.click()}
                                >
                                    <PhotoIcon className="w-12 h-12 mx-auto text-base-content/40 group-hover:text-primary transition-colors" />
                                    <p className="mt-2 text-sm text-base-content/60">Click to upload "Before" photo</p>
                                </div>
                            )}
                        </div>

                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text font-bold">After Photo</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={afterInputRef}
                                onChange={(e) => handleImageChange(e, false)}
                            />
                            {afterImage ? (
                                <div className="relative rounded-lg overflow-hidden border-2 border-base-300 h-64">
                                    <img src={afterImage} alt="After" className="w-full h-full object-cover" />
                                    <button
                                        className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
                                        onClick={() => removeImage(false)}
                                    >
                                        <XMarkIcon className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center cursor-pointer hover:bg-base-200 transition-colors group"
                                    onClick={() => afterInputRef.current?.click()}
                                >
                                    <PhotoIcon className="w-12 h-12 mx-auto text-base-content/40 group-hover:text-primary transition-colors" />
                                    <p className="mt-2 text-sm text-base-content/60">Click to upload "After" photo</p>
                                </div>
                            )}
                        </div>

                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text font-bold">Description</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24 focus:border-primary"
                                placeholder="Where was this? What did you clean?"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="card-actions justify-end mt-6">
                            <button
                                className={`btn btn-primary w-full ${isUploading ? "loading" : ""}`}
                                onClick={handleUpload}
                                disabled={!connectedAddress || isUploading || !beforeImage || !afterImage || !description}
                            >
                                {!connectedAddress ? "Connect Wallet" : "Upload Proof"}
                                {!isUploading && <ArrowUpTrayIcon className="w-4 h-4 ml-2" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CleanPage;
