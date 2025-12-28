import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CandidateResult } from "@/types";
import { 
  Search, 
  Users, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Download,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface HRDashboardProps {
  results: CandidateResult[];
}

const HRDashboard = ({ results }: HRDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "recommended" | "not_recommended">("all");
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);

  const filteredResults = results.filter(result => {
    const matchesSearch = 
      result.userData.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.userData.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.userData.phone.includes(searchQuery);
    
    const matchesFilter = 
      filter === "all" || result.recommendation === filter;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: results.length,
    recommended: results.filter(r => r.recommendation === "recommended").length,
    notRecommended: results.filter(r => r.recommendation === "not_recommended").length,
    avgScore: results.length > 0 
      ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
      : 0
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="p-6 border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-10">
        <div className="container max-w-7xl flex justify-between items-center">
          <Logo />
          <span className="text-sm text-muted-foreground px-3 py-1 bg-secondary/50 rounded-full">
            HR Admin Panel
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl py-8 px-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm animate-slide-up" style={{ animationDelay: "0ms" }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Candidates</p>
                  <p className="text-3xl font-display font-bold text-foreground">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="text-primary" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/60 backdrop-blur-sm animate-slide-up" style={{ animationDelay: "50ms" }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recommended</p>
                  <p className="text-3xl font-display font-bold text-accent">{stats.recommended}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="text-accent" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/60 backdrop-blur-sm animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Not Recommended</p>
                  <p className="text-3xl font-display font-bold text-destructive">{stats.notRecommended}</p>
                </div>
                <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                  <XCircle className="text-destructive" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/60 backdrop-blur-sm animate-slide-up" style={{ animationDelay: "150ms" }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-3xl font-display font-bold text-foreground">{stats.avgScore}%</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-primary" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results List */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm animate-slide-up" style={{ animationDelay: "200ms" }}>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>Candidate Performance</CardTitle>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Search by name, ID, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={filter === "all" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All
                  </Button>
                  <Button 
                    variant={filter === "recommended" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilter("recommended")}
                  >
                    Recommended
                  </Button>
                  <Button 
                    variant={filter === "not_recommended" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilter("not_recommended")}
                  >
                    Not Recommended
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Download size={16} />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredResults.length > 0 ? (
                filteredResults.map((result, index) => (
                  <div
                    key={index}
                    className="border border-border/50 rounded-xl overflow-hidden bg-background/30"
                  >
                    <div 
                      className="p-4 cursor-pointer hover:bg-secondary/20 transition-colors"
                      onClick={() => setExpandedCandidate(expandedCandidate === result.timestamp ? null : result.timestamp)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              {result.userData.fullName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{result.userData.fullName}</h3>
                            <p className="text-sm text-muted-foreground">{result.userData.domain} • {result.userData.registrationNo}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground">{result.score}%</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              result.recommendation === 'recommended' 
                                ? 'bg-accent/20 text-accent' 
                                : 'bg-destructive/20 text-destructive'
                            }`}>
                              {result.recommendation === 'recommended' ? 'Recommended' : 'Not Recommended'}
                            </span>
                          </div>
                          {expandedCandidate === result.timestamp ? (
                            <ChevronUp className="text-muted-foreground" size={20} />
                          ) : (
                            <ChevronDown className="text-muted-foreground" size={20} />
                          )}
                        </div>
                      </div>
                    </div>

                    {expandedCandidate === result.timestamp && (
                      <div className="border-t border-border/50 p-4 bg-secondary/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="text-sm text-foreground">{result.userData.phone}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Assessment Date</p>
                            <p className="text-sm text-foreground">{formatDate(result.timestamp)}</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground mb-2">AI Summary</p>
                          <p className="text-sm text-foreground bg-background/50 p-3 rounded-lg">{result.summary}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Responses ({result.responses.length})</p>
                          <div className="space-y-2">
                            {result.responses.map((response, rIndex) => (
                              <div key={rIndex} className="bg-background/50 p-3 rounded-lg">
                                <p className="text-xs text-primary font-medium mb-1">Q: {response.question}</p>
                                <p className="text-sm text-foreground">{response.answer}</p>
                                <p className="text-xs text-muted-foreground mt-1">Score: {response.score}%</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {results.length === 0 
                      ? "No candidates have completed assessments yet" 
                      : "No candidates found matching your criteria"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HRDashboard;
