import { useState } from "react";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Copy, CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { CONTRACT_TEMPLATES, getContractTemplate, getAllContractCategories } from "@/data/contract-templates";

export function ContractTemplatesPage() {
  const { state } = useWeddingStoreContext();
  const lang = state.lang || "vi";
  const en = lang === "en";

  const [selectedCategory, setSelectedCategory] = useState<string>("venue");
  const [expandedClauses, setExpandedClauses] = useState<Set<string>>(new Set());
  const [copiedClause, setCopiedClause] = useState<string | null>(null);

  const categories = getAllContractCategories();
  const selectedTemplate = getContractTemplate(selectedCategory);

  const toggleClause = (clauseId: string) => {
    setExpandedClauses(prev => {
      const next = new Set(prev);
      if (next.has(clauseId)) {
        next.delete(clauseId);
      } else {
        next.add(clauseId);
      }
      return next;
    });
  };

  const copyToClipboard = (text: string, clauseId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClause(clauseId);
    setTimeout(() => setCopiedClause(null), 2000);
  };

  const copyTemplateToClipboard = (template: typeof CONTRACT_TEMPLATES[0]) => {
    const text = en ? template.descriptionEn : template.descriptionVi;
    const fullText = `${template.categoryEn} Contract Template\n\n${text}\n\n${template.clauses.map(c => c.titleEn + ": " + c.contentEn).join("\n\n")}`;
    navigator.clipboard.writeText(fullText);
    setCopiedClause("template-" + template.id);
    setTimeout(() => setCopiedClause(null), 2000);
  };

  return (
    <div className="space-y-4 py-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-primary)]">
            {en ? "📄 Contract Template Library" : "📄 Thư viện Mẫu Hợp Đồng"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {en ? "Pre-written contract templates for wedding vendors" : "Mẫu hợp đồng có sẵn cho nhà cung cấp đám cưới"}
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {categories.map((cat) => (
            <TabsTrigger key={cat.category} value={cat.category} className="text-xs">
              {lang === "vi" ? cat.categoryVi : cat.categoryEn}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => {
          const template = getContractTemplate(category.category);
          if (!template) return null;

          return (
            <TabsContent key={category.category} value={category.category} className="space-y-4">
              {/* Template Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {lang === "vi" ? template.categoryVi : template.categoryEn}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {lang === "vi" ? template.descriptionVi : template.descriptionEn}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyTemplateToClipboard(template)}
                      className="gap-2"
                    >
                      {copiedClause === "template-" + template.id ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          {en ? "Copied!" : "Đã chép!"}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {en ? "Copy All" : "Chép tất cả"}
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Payment Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {en ? "💳 Payment Terms" : "💳 Điều khoản thanh toán"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{lang === "vi" ? template.paymentTermsVi : template.paymentTermsEn}</p>
                </CardContent>
              </Card>

              {/* Cancellation Policy */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {en ? "🚫 Cancellation Policy" : "🚫 Chính sách hủy hợp đồng"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{lang === "vi" ? template.cancellationPolicyVi : template.cancellationPolicyEn}</p>
                </CardContent>
              </Card>

              {/* Warranty Terms (if applicable) */}
              {template.warrantyTermsVi && template.warrantyTermsEn && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      {en ? "🛡️ Warranty Terms" : "🛡️ Điều khoản bảo hành"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{lang === "vi" ? template.warrantyTermsVi : template.warrantyTermsEn}</p>
                  </CardContent>
                </Card>
              )}

              {/* Contract Clauses */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {en ? "📋 Contract Clauses" : "📋 Các điều khoản hợp đồng"}
                  </CardTitle>
                  <CardDescription>
                    {en ? "Click on each clause to expand and copy" : "Nhấn vào mỗi điều khoản để xem và chép"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {template.clauses.map((clause) => {
                    const isExpanded = expandedClauses.has(clause.id);
                    return (
                      <div
                        key={clause.id}
                        className="border rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleClause(clause.id)}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                              <h4 className="font-medium text-sm">
                                {lang === "vi" ? clause.titleVi : clause.titleEn}
                              </h4>
                              {clause.required && (
                                <Badge variant="destructive" className="text-xs">
                                  {en ? "Required" : "Bắt buộc"}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(
                              lang === "vi" ? clause.contentVi : clause.contentEn,
                              clause.id
                            )}
                            className="gap-1"
                          >
                            {copiedClause === clause.id ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                {en ? "Copied!" : "Đã chép!"}
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                {en ? "Copy" : "Chép"}
                              </>
                            )}
                          </Button>
                        </div>

                        {isExpanded && (
                          <div className="pl-8 pr-12 text-sm text-muted-foreground whitespace-pre-wrap">
                            {lang === "vi" ? clause.contentVi : clause.contentEn}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Usage Tips */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">
            {en ? "💡 How to Use These Templates" : "💡 Cách sử dụng mẫu này"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            {en
              ? "1. Select a template from the tabs above that matches your vendor category"
              : "1. Chọn mẫu tương ứng với loại nhà cung cấp từ tab ở trên"}
          </p>
          <p>
            {en
              ? "2. Click on each clause to expand and read the full content"
              : "2. Nhấn vào mỗi điều khoản để xem chi tiết"}
          </p>
          <p>
            {en
              ? "3. Use the copy button to copy individual clauses or the entire template"
              : "3. Sử dụng nút chép để sao chép từng điều khoản hoặc toàn bộ mẫu"}
          </p>
          <p>
            {en
              ? "4. Customize the template to match your specific needs and wedding details"
              : "4. Chỉnh sửa mẫu cho phù hợp với nhu cầu và chi tiết đám cưới của bạn"}
          </p>
          <p>
            {en
              ? "5. Use these templates when creating new contracts in the Contracts section"
              : "5. Sử dụng mẫu này khi tạo hợp đồng mới trong phần Hợp đồng"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
