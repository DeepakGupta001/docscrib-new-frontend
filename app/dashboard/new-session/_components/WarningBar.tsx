import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function WarningBar() {
  return (
    <Alert variant="info" className='mt-2'>
      <AlertTitle>Important:</AlertTitle>
      <AlertDescription>  Review your note before use to ensure it accurately represents the visit.</AlertDescription>
    </Alert>
  );
}
