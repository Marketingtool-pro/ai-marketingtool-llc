import { useState } from 'react';

// @project
import ColorPicker from '@/components/ColorPicker';
import PageAnimateWrapper from '@/components/PageAnimateWrapper';
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  PLUGINES - COLOR PICKER  ***************************/

export default function ColorPcikerPage() {
  const [color, setColor] = useState('#606BDF');

  return (
    <PageAnimateWrapper>
      <PresentationCard title="Color Picker">
        <ColorPicker label="Primary color" defaultColor={color} onColorChange={(data) => setColor(data)} />
      </PresentationCard>
    </PageAnimateWrapper>
  );
}
