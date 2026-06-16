import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FileUploadForm from './FileUploadForm';

const UploadModal = ({ isOpen, onClose, onUpload, loading }) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="glass-card border border-white/10 rounded-2xl p-6 max-w-md">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-bold text-white">Upload New File</DialogTitle>
                </DialogHeader>
                <FileUploadForm onUpload={onUpload} loading={loading} />
            </DialogContent>
        </Dialog>
    );
};

export default UploadModal;

