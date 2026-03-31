"use client";

import { useState } from "react";
import Card from "@/components/card";
import Button from "@/components/button";
import Input from "@/components/input";
import SectionWrapper from "@/components/section-wrapper";

type Tab = "m3u" | "xtream";

export default function ManagePlaylistPage() {
  const [activeTab, setActiveTab] = useState<Tab>("m3u");
  const [m3uUrl, setM3uUrl] = useState("");
  const [xtreamUsername, setXtreamUsername] = useState("");
  const [xtreamPassword, setXtreamPassword] = useState("");
  const [xtreamServer, setXtreamServer] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <SectionWrapper title="Manage Playlist" subtitle="Add your M3U URL or Xtream Codes credentials.">
      <div className="mx-auto max-w-lg">
        <Card>
          {/* Tabs */}
          <div className="mb-6 flex rounded-xl bg-background p-1">
            <button
              type="button"
              onClick={() => setActiveTab("m3u")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                activeTab === "m3u"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-white"
              }`}
            >
              M3U Playlist
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("xtream")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                activeTab === "xtream"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-white"
              }`}
            >
              Xtream Codes
            </button>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            {activeTab === "m3u" ? (
              <Input
                label="Playlist URL"
                name="m3uUrl"
                placeholder="http://example.com/playlist.m3u"
                value={m3uUrl}
                onChange={(e) => setM3uUrl(e.target.value)}
              />
            ) : (
              <>
                <Input
                  label="Username"
                  name="xtreamUsername"
                  placeholder="your_username"
                  value={xtreamUsername}
                  onChange={(e) => setXtreamUsername(e.target.value)}
                />
                <Input
                  label="Password"
                  name="xtreamPassword"
                  type="password"
                  placeholder="your_password"
                  value={xtreamPassword}
                  onChange={(e) => setXtreamPassword(e.target.value)}
                />
                <Input
                  label="Server URL"
                  name="xtreamServer"
                  placeholder="http://example.com:8080"
                  value={xtreamServer}
                  onChange={(e) => setXtreamServer(e.target.value)}
                />
              </>
            )}

            {saved && (
              <p className="rounded-lg bg-green-500/10 px-4 py-2 text-sm text-green-400">
                Playlist saved successfully!
              </p>
            )}

            <Button type="submit" className="w-full py-4">
              Save Playlist
            </Button>
          </form>
        </Card>
      </div>
    </SectionWrapper>
  );
}
