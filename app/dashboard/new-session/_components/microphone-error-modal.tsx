"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Mic, Settings, ExternalLink, RefreshCw } from "lucide-react"

interface MicrophoneErrorModalProps {
  isOpen: boolean
  onClose: () => void
  onRetry?: () => void
}

export function MicrophoneErrorModal({
  isOpen,
  onClose,
  onRetry
}: MicrophoneErrorModalProps) {
  const handleOpenBrowserSettings = async () => {
    try {
      // Try to trigger the browser's native permission dialog
      // This will show the browser's microphone permission popup
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });
      
      // If we get here, permission was granted
      console.log('Microphone permission granted!');
      
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      // Close the modal first
      onClose();
      
      // Wait a moment for the modal to close, then trigger recording
      setTimeout(() => {
        if (onRetry) {
          onRetry();
        }
      }, 100);
      
    } catch (error) {
      console.error('Permission still denied:', error);
      
      // If permission is still denied, show instructions
      const userAgent = navigator.userAgent;
      let instructions = '';
      
      if (userAgent.includes('Chrome')) {
        instructions = 'Chrome: Click the lock icon in the address bar → Microphone → Allow';
      } else if (userAgent.includes('Firefox')) {
        instructions = 'Firefox: Click the shield icon → Permissions → Microphone → Allow';
      } else if (userAgent.includes('Safari')) {
        instructions = 'Safari: Safari menu → Settings → Websites → Microphone → Allow';
      } else if (userAgent.includes('Edge')) {
        instructions = 'Edge: Click the lock icon in the address bar → Microphone → Allow';
      } else {
        instructions = 'Go to your browser settings and enable microphone access for this site';
      }
      
      alert(`Permission still denied. Please:\n\n${instructions}\n\nThen try again.`);
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="sr-only">Microphone Error</DialogTitle>
          
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
              <Mic className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-red-600">
              Microphone access denied
            </h3>
            <p className="text-gray-700 text-sm">
              Click the button below to request microphone permission from your browser.
            </p>
            
            {/* Browser-specific instructions */}
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                How to enable microphone access:
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Chrome/Edge:</strong> Click the lock icon in the address bar → Microphone → Allow</p>
                <p><strong>Firefox:</strong> Click the shield icon → Permissions → Microphone → Allow</p>
                <p><strong>Safari:</strong> Safari menu → Settings → Websites → Microphone → Allow</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleOpenBrowserSettings}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              variant="default"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Request Microphone Permission
            </Button>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleRetry}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button 
                onClick={onClose}
                variant="ghost"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
