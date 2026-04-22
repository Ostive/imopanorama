import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { MediaLibrary } from './MediaLibrary';

interface MediaLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    initialPath?: string;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    initialPath
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Médiathèque</DialogTitle>
                </DialogHeader>
                <div className="flex-1 p-6 pt-0 overflow-hidden">
                    <MediaLibrary
                        onSelect={(url) => {
                            onSelect(url);
                            onClose();
                        }}
                        selectionMode={true}
                        initialPath={initialPath}
                        className="h-full"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
