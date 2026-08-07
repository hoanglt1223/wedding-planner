import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Star,
  StarOff,
  Share2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import {
  generateHashtagSuggestions,
  copyHashtag,
  formatHashtagsForSharing,
  type HashtagSuggestion,
  type HashtagCategory,
} from "@/lib/hashtag-generator";

interface HashtagGeneratorProps {
  brideName: string;
  groomName: string;
  weddingDate: string;
  generatedHashtags: string[];
  favoriteHashtags: string[];
  onGenerateHashtags: (hashtags: string[]) => void;
  onToggleFavorite: (tag: string) => void;
  onClearGenerated: () => void;
  lang: "en" | "vi";
}

const categoryColors: Record<HashtagCategory, string> = {
  romantic: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  fun: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  simple: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  creative: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  vietnamese: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const categoryLabels: Record<HashtagCategory, { en: string; vi: string }> = {
  romantic: { en: "Romantic", vi: "Lãng mạn" },
  fun: { en: "Fun", vi: "Vui vẻ" },
  simple: { en: "Simple", vi: "Đơn giản" },
  creative: { en: "Creative", vi: "Sáng tạo" },
  vietnamese: { en: "Vietnamese", vi: "Tiếng Việt" },
};

export function HashtagGenerator({
  brideName,
  groomName,
  weddingDate,
  generatedHashtags,
  favoriteHashtags,
  onGenerateHashtags,
  onToggleFavorite,
  onClearGenerated,
  lang,
}: HashtagGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState<HashtagCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [allSuggestions, setAllSuggestions] = useState<HashtagSuggestion[]>([]);

  const handleGenerate = () => {
    const suggestions = generateHashtagSuggestions({
      bride: brideName,
      groom: groomName,
      date: weddingDate,
      // Add minimal required fields
      brideFamilyName: "",
      groomFamilyName: "",
      engagementDate: "",
      betrothalDate: "",
      brideBirthDate: "",
      brideBirthHour: null,
      brideGender: "female",
      groomBirthDate: "",
      groomBirthHour: null,
      groomGender: "male",
      venueCity: "hcmc",
    });

    setAllSuggestions(suggestions);
    onGenerateHashtags(suggestions.map(s => s.tag));
  };

  const filteredHashtags = allSuggestions.filter(suggestion => {
    const matchesCategory = selectedCategory === "all" || suggestion.category === selectedCategory;
    const matchesSearch = suggestion.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedHashtags = filteredHashtags.length > 0 ? filteredHashtags : allSuggestions;

  const handleCopy = async (tag: string) => {
    const success = await copyHashtag(tag);
    if (success) {
      setCopiedTag(tag);
      setTimeout(() => setCopiedTag(null), 2000);
    }
  };

  const handleCopyAll = async () => {
    const tagsToCopy = selectedCategory === "all"
      ? displayedHashtags.map(s => s.tag)
      : displayedHashtags.filter(s => s.category === selectedCategory).map(s => s.tag);

    const text = formatHashtagsForSharing(tagsToCopy);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTag("all");
      setTimeout(() => setCopiedTag(null), 2000);
    } catch {
      // Handle error
    }
  };

  const handleShare = async () => {
    const tagsToShare = favoriteHashtags.length > 0 ? favoriteHashtags : generatedHashtags;
    const text = formatHashtagsForSharing(tagsToShare);

    if (navigator.share) {
      try {
        await navigator.share({
          title: lang === "vi" ? "Hashtag Đám Cưới" : "Wedding Hashtags",
          text: text,
        });
      } catch {
        // Handle cancellation or error
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(text);
      setCopiedTag("shared");
      setTimeout(() => setCopiedTag(null), 2000);
    }
  };

  const isFavorite = (tag: string) => favoriteHashtags.includes(tag);

  const text = {
    en: {
      title: "Wedding Hashtag Generator",
      description: "Create perfect hashtags for your big day",
      generate: "Generate Hashtags",
      clear: "Clear All",
      copy: "Copy",
      copied: "Copied!",
      copyAll: "Copy All",
      share: "Share",
      favorites: "Favorites",
      all: "All",
      search: "Search hashtags...",
      noResults: "No hashtags found",
      noFavorites: "No favorite hashtags yet",
      startOver: "Generate new hashtags to get started",
      reason: "Why this works",
    },
    vi: {
      title: "Tạo Hashtag Đám Cưới",
      description: "Tạo hashtag hoàn hảo cho ngày trọng đại",
      generate: "Tạo Hashtag",
      clear: "Xóa Tất Cả",
      copy: "Sao Chép",
      copied: "Đã Sao Chép!",
      copyAll: "Sao Chép Tất Cả",
      share: "Chia Sẻ",
      favorites: "Yêu Thích",
      all: "Tất Cả",
      search: "Tìm hashtag...",
      noResults: "Không tìm thấy hashtag",
      noFavorites: "Chưa có hashtag yêu thích",
      startOver: "Tạo hashtag mới để bắt đầu",
      reason: "Tại sao hashtag này hay",
    },
  };

  const t = text[lang];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Generate Button */}
          <div className="flex gap-2">
            <Button onClick={handleGenerate} className="flex-1" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t.generate}
            </Button>
            {generatedHashtags.length > 0 && (
              <Button onClick={onClearGenerated} variant="outline">
                <X className="mr-2 h-4 w-4" />
                {t.clear}
              </Button>
            )}
          </div>

          {/* Search and Filter */}
          {generatedHashtags.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as HashtagCategory | "all")}
                className="w-full sm:w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">{t.all}</option>
                {Object.entries(categoryLabels).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value[lang]}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Copy All and Share */}
          {generatedHashtags.length > 0 && (
            <div className="flex gap-2">
              <Button onClick={handleCopyAll} variant="outline" className="flex-1">
                <Copy className="mr-2 h-4 w-4" />
                {t.copyAll}
              </Button>
              <Button onClick={handleShare} variant="outline" className="flex-1">
                <Share2 className="mr-2 h-4 w-4" />
                {t.share}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Generated and Favorites */}
      {generatedHashtags.length > 0 && (
        <Tabs defaultValue="generated" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generated">
              {text.en.generate} ({displayedHashtags.length})
            </TabsTrigger>
            <TabsTrigger value="favorites">
              {t.favorites} ({favoriteHashtags.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generated" className="space-y-2 mt-4">
            {displayedHashtags.map((suggestion, index) => (
              <Card key={`${suggestion.tag}-${index}`} className="hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-lg font-semibold">#{suggestion.tag}</code>
                        <Badge className={categoryColors[suggestion.category]}>
                          {categoryLabels[suggestion.category][lang]}
                        </Badge>
                        {isFavorite(suggestion.tag) && (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onToggleFavorite(suggestion.tag)}
                        title={isFavorite(suggestion.tag) ? "Remove from favorites" : "Add to favorites"}
                      >
                        {isFavorite(suggestion.tag) ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(suggestion.tag)}
                        title={t.copy}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-2 mt-4">
            {favoriteHashtags.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <StarOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">{t.noFavorites}</p>
                  <p className="text-sm text-muted-foreground mt-2">{t.startOver}</p>
                </CardContent>
              </Card>
            ) : (
              favoriteHashtags.map((tag, index) => (
                <Card key={`${tag}-${index}`} className="hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-lg font-semibold">#{tag}</code>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onToggleFavorite(tag)}
                          title="Remove from favorites"
                        >
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(tag)}
                          title={t.copy}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Copied Feedback */}
      {copiedTag && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-bottom-2">
          {copiedTag === "all" || copiedTag === "shared" ? t.copied : `#${copiedTag} ${t.copied}`}
        </div>
      )}
    </div>
  );
}
