// @third-party
import { useForm } from 'react-hook-form';

// @project
import PresentationCard from '@/components/cards/PresentationCard';
import PageAnimateWrapper from '@/components/PageAnimateWrapper';
import ReactQuill from '@/components/third-party/editor/ReactQuill';

/***************************  PLUGINES - QUILLEDITOR  ***************************/

export default function QuillEditor() {
  const { control } = useForm({
    defaultValues: { content: '<p><br></p>' }
  });

  return (
    <PageAnimateWrapper>
      <PresentationCard title="Quill Editor">
        <ReactQuill control={control} />
      </PresentationCard>
    </PageAnimateWrapper>
  );
}
