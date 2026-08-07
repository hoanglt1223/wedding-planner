import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileJson,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Download,
  Users,
  Building2,
  Calendar,
  DollarSign,
  Info,
} from "lucide-react";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import {
  importWeddingStateFromJson,
  mergeWeddingStates,
  checkVersionCompatibility,
  getImportSummary,
  type ValidationResult,
} from "@/lib/wedding-state-import";
import { getTimestamp, exportStateAsJson, downloadFile } from "@/lib/export-utils";

type ImportMode = "replace" | "merge";

interface ImportSummary {
  guestCount: number;
  vendorCount: number;
  expenseCount: number;
  weddingDate: string;
  hasBudget: boolean;
  hasTimeline: boolean;
  coupleNames: string;
}

export function ImportPanel() {
  const { state, setState } = useWeddingStoreContext();
  const lang = state.lang;
  const en = lang === "en";

  const [file, setFile] = useState<File | null>(null);
  const [importedData, setImportedData] = useState<any>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>("replace");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const labels = {
    title: en ? "Import Wedding Data" : "Nhập Dữ Liệu Đám Cưới",
    description: en
      ? "Restore your wedding data from a previously exported JSON file"
      : "Khôi phục dữ liệu đám cưới từ tệp JSON đã xuất trước đó",
    selectFile: en ? "Select JSON File" : "Chọn Tệp JSON",
    acceptedFormats: en ? "Accepted format: .json" : "Định dạng chấp nhận: .json",
    uploadButton: en ? "Upload & Validate" : "Tải Lên & Kiểm Tra",
    dragDrop: en ? "Drag and drop your JSON file here, or click to browse" : "Kéo và thả tệp JSON của bạn vào đây, hoặc nhấn để duyệt",
    importMode: en ? "Import Mode" : "Chế Độ Nhập",
    replaceMode: en ? "Replace All Data" : "Thay Thế Tất Cả Dữ Liệu",
    mergeMode: en ? "Merge with Existing Data" : "Hợp Nhập Với Dữ Liệu Hiện Tại",
    replaceDesc: en
      ? "All current data will be replaced with imported data"
      : "Tất cả dữ liệu hiện tại sẽ được thay thế bằng dữ liệu đã nhập",
    mergeDesc: en
      ? "Imported data will be combined with current data"
      : "Dữ liệu đã nhập sẽ được kết hợp với dữ liệu hiện tại",
    preview: en ? "Preview Import" : "Xem Trước Khi Nhập",
    coupleNames: en ? "Couple Names" : "Tên Cặp Đôi",
    weddingDate: en ? "Wedding Date" : "Ngày Cưới",
    guests: en ? "Guests" : "Khách Mời",
    vendors: en ? "Vendors" : "Nhà Cung Cấp",
    expenses: en ? "Expenses" : "Chi Tiêu",
    budget: en ? "Budget" : "Ngân Sách",
    timeline: en ? "Timeline" : "Lịch Trình",
    confirmImport: en ? "Confirm Import" : "Xác Nhận Nhập",
    backup: en ? "Create Backup Before Import" : "Tạo Bản Sao Lưu Trước Khi Nhập",
    backupDesc: en
      ? "Download backup of current data before importing"
      : "Tải xuống bản sao lưu dữ liệu hiện tại trước khi nhập",
    importSuccess: en ? "Import Successful!" : "Nhập Dữ Liệu Thành Công!",
    importSuccessDesc: en
      ? "Your wedding data has been imported successfully"
      : "Dữ liệu đám cưới của bạn đã được nhập thành công",
    validationErrors: en ? "Validation Errors" : "Lỗi Kiểm Tra",
    validationWarnings: en ? "Warnings" : "Cảnh Báo",
    warnings: en ? "Warnings" : "Cảnh Báo",
    validFile: en ? "Valid File" : "Tệp Hợp Lệ",
    invalidFile: en ? "Invalid File" : "Tệp Không Hợp Lệ",
    noFile: en ? "No file selected" : "Chưa chọn tệp",
  };

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setImportedData(null);
    setValidation(null);
    setError(null);
    setSuccess(false);
  };

  const handleUploadAndValidate = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const result = importWeddingStateFromJson(text);

      if (!result.success) {
        setError(result.error || "Failed to import file");
        setValidation(result.validation ?? null);
        setImportedData(null);
      } else {
        setImportedData(result.data);
        setValidation(result.validation ?? null);

        // Check version compatibility
        const compatibility = checkVersionCompatibility(result.data!);
        if (!compatibility.compatible) {
          setError(compatibility.message || "Incompatible data version");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to read file");
      setImportedData(null);
      setValidation(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!importedData || !validation?.isValid) return;

    setIsProcessing(true);

    try {
      // Create backup if requested
      if (importMode === "replace") {
        const backup = exportStateAsJson(state);
        const timestamp = getTimestamp();
        downloadFile(backup, `wedding-backup-${timestamp}.json`, "application/json");
      }

      // Perform import
      let newState: typeof state;
      if (importMode === "merge") {
        newState = mergeWeddingStates(state, importedData);
      } else {
        newState = importedData;
      }

      setState(newState);
      setSuccess(true);

      // Reset form
      setTimeout(() => {
        setFile(null);
        setImportedData(null);
        setValidation(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/json") {
      handleFileSelect(droppedFile);
    } else {
      setError("Please select a JSON file");
    }
  };

  const summary: ImportSummary | null = importedData ? getImportSummary(importedData) : null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{labels.title}</h2>
        <p className="text-sm text-muted-foreground">{labels.description}</p>
      </div>

      {/* Success Message */}
      {success && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-green-800">
                <div className="font-medium">{labels.importSuccess}</div>
                <div className="text-sm">{labels.importSuccessDesc}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && !validation && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-red-800">{error}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {labels.selectFile}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              file ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            />
            <FileJson className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{labels.dragDrop}</p>
            <p className="text-xs text-muted-foreground mt-1">{labels.acceptedFormats}</p>
            {file && (
              <div className="mt-3 text-sm font-medium text-primary">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          <Button
            onClick={handleUploadAndValidate}
            disabled={!file || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                {en ? "Processing..." : "Đang xử lý..."}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {labels.uploadButton}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validation && (
        <>
          {validation.isValid ? (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="text-green-800">
                    {labels.validFile}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div className="text-red-800">
                    {labels.invalidFile}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Validation Errors */}
          {validation.errors.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-base text-red-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {labels.validationErrors} ({validation.errors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-red-700">
                  {validation.errors.map((err, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>
                        <code className="bg-red-50 px-1 py-0.5 rounded text-xs">
                          {err.field}
                        </code>
                        : {err.message}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Validation Warnings */}
          {validation.warnings.length > 0 && (
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-base text-yellow-800 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {labels.warnings} ({validation.warnings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-yellow-700">
                  {validation.warnings.map((warn, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">•</span>
                      <span>
                        <code className="bg-yellow-50 px-1 py-0.5 rounded text-xs">
                          {warn.field}
                        </code>
                        : {warn.message}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Import Preview */}
      {validation?.isValid && importedData && summary && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4" />
                {labels.preview}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">{labels.coupleNames}</Label>
                  <div className="font-medium">{summary.coupleNames}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">{labels.weddingDate}</Label>
                  <div className="font-medium">{summary.weddingDate}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{labels.guests}:</span>
                  <span className="font-medium">{summary.guestCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{labels.vendors}:</span>
                  <span className="font-medium">{summary.vendorCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{labels.expenses}:</span>
                  <span className="font-medium">{summary.expenseCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{labels.timeline}:</span>
                  <span className="font-medium">{summary.hasTimeline ? en ? "Yes" : "Có" : en ? "No" : "Không"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Import Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{labels.importMode}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === "replace"}
                    onChange={() => setImportMode("replace")}
                    className="accent-primary"
                  />
                  <span className="font-medium">{labels.replaceMode}</span>
                </Label>
                <p className="text-sm text-muted-foreground ml-6">{labels.replaceDesc}</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="merge"
                    checked={importMode === "merge"}
                    onChange={() => setImportMode("merge")}
                    className="accent-primary"
                  />
                  <span className="font-medium">{labels.mergeMode}</span>
                </Label>
                <p className="text-sm text-muted-foreground ml-6">{labels.mergeDesc}</p>
              </div>

              {importMode === "replace" && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-yellow-800 text-sm">
                        {en
                          ? "⚠️ Your current data will be completely replaced. A backup will be downloaded automatically."
                          : "⚠️ Dữ liệu hiện tại của bạn sẽ bị thay thế hoàn toàn. Bản sao lưu sẽ được tải xuống tự động."}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Confirm Button */}
          <Button
            onClick={handleImport}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                {en ? "Importing..." : "Đang nhập..."}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {labels.confirmImport}
              </>
            )}
          </Button>
        </>
      )}

      {/* Info Card */}
      <Card className="bg-muted">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">
              {en ? "Tips:" : "Mẹo:"}
            </p>
            <ul className="space-y-1 text-xs">
              <li>• {en ? "Only import JSON files exported from this app" : "Chỉ nhập tệp JSON được xuất từ ứng dụng này"}</li>
              <li>• {en ? "Replace mode: creates automatic backup of current data" : "Chế độ thay thế: tạo bản sao lưu tự động của dữ liệu hiện tại"}</li>
              <li>• {en ? "Merge mode: combines data without duplicates" : "Chế độ hợp nhất: kết hợp dữ liệu không trùng lặp"}</li>
              <li>• {en ? "Validation ensures data integrity before import" : "Kiểm tra đảm bảo tính toàn vẹn dữ liệu trước khi nhập"}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
