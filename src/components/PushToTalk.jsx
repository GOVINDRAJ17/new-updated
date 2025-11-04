import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const PushToTalk = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      return stream;
    } catch (error) {
      setHasPermission(false);
      toast.error("Microphone access denied. Please enable it in your browser settings.");
      return null;
    }
  };

  const startRecording = async () => {
    const stream = await requestMicrophonePermission();
    if (!stream) return;

    try {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        
        // Simulate processing
        setTimeout(() => {
          toast.success("Voice message recorded!");
          setIsProcessing(false);
        }, 1000);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording... Release to stop");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Card className="shadow-soft border-2">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Push to Talk</h3>
          <p className="text-sm text-muted-foreground">
            {hasPermission === false 
              ? "Microphone access required. Please enable it in settings." 
              : "Hold to record, release to send"}
          </p>
          
          <div className="flex justify-center">
            <Button
              size="lg"
              className={`rounded-full w-24 h-24 ${
                isRecording 
                  ? "bg-destructive hover:bg-destructive/90 animate-pulse" 
                  : "gradient-primary"
              }`}
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={isProcessing || hasPermission === false}
            >
              {isRecording ? (
                <MicOff className="w-12 h-12" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </Button>
          </div>

          {isProcessing && (
            <p className="text-sm text-primary animate-pulse">Processing audio...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PushToTalk;
