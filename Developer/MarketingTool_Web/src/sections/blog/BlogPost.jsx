import PropTypes from 'prop-types';
import { useEffect, useImperativeHandle, useMemo, useState, useTransition } from 'react';

// @mui
import useMediaQuery from '@mui/material/useMediaQuery';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { isEqual } from 'lodash-es';
import { enqueueSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';

// @project
import { saveDraft, savePublish } from './api';
import BlogPreview from './BlogPreview';
import { categoryOptions } from './data/blogs';

import MainCard from '@/components/MainCard';
import Typeset from '@/components/Typeset';
import DialogExitAlert from '@/components/dialog/DialogExitAlert';
import ReactQuill from '@/components/third-party/editor/ReactQuill';
import SingleFileUpload from '@/components/third-party/dropzone/SingleFile';
import { getBase64 } from '@/utils/common';
import { useRouter } from '@/utils/navigation';
import { getBlogFormSchemas, trimOnBlur } from '@/utils/validation-schema/blog';

const dialogExitData = {
  title: 'Exit Alert',
  heading: 'Are you sure you want exit?'
};

const initialData = {
  title: '',
  caption: '',
  tags: [],
  categories: [],
  seoTitle: '',
  slug: '',
  description: '',
  banner: { name: '', size: 0, url: '' },
  content: '<p><br></p>'
};

/***************************  BLOG - OPTIONAL FIELD LABEL  ***************************/

function OptionalFieldLabel({ label }) {
  return (
    <Stack direction="row" component={InputLabel} sx={{ gap: 0.5 }}>
      {label}
      <Typography variant="body2" color="text.secondary">
        (Optional)
      </Typography>
    </Stack>
  );
}

/***************************  BLOG - NEW POST  ***************************/

export default function BlogPost({ preview, setPreview, blogData, ref }) {
  const router = useRouter();
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [isPublishing, setIsPublishing] = useState(true);
  const [isDraftProcessing, startDraftTransition] = useTransition();
  const [isBlogProcessing, startBlogTransition] = useTransition();
  const [previewBanner, setPreviewBanner] = useState({ name: '', size: 0, url: '' });

  const schemas = useMemo(() => getBlogFormSchemas(isPublishing), [isPublishing]);

  // Get schema
  const { titleSchema, slugSchema, categorySchema, seoTitleSchema, contentSchema, bannerSchema } = schemas;

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty }
  } = useForm({ defaultValues: initialData });

  const formValues = watch();

  //if form data is passed, set the form values
  useEffect(() => {
    const formInitData = blogData
      ? {
          title: blogData.title,
          caption: blogData.caption,
          tags: blogData.tags,
          categories: blogData.categories,
          seoTitle: blogData?.seo?.title || '',
          slug: blogData.slug,
          description: blogData?.seo?.description || '',
          banner: blogData.banner,
          content: blogData.content || '<p><br></p>'
        }
      : initialData;
    reset(formInitData);
  }, [blogData, reset]);

  useEffect(() => {
    const hasChanged = !isEqual(initialData, formValues);
    if (preview !== hasChanged) {
      setPreview(hasChanged);
    }
  }, [formValues, preview, setPreview]);

  const onSubmit = (status) => (data) => {
    const formData = new FormData();

    // Simple fields
    formData.append('title', data.title);
    formData.append('slug', data.slug || '');
    formData.append('caption', data.caption || '');
    formData.append('content', data.content || '');

    // Arrays (tags, categories)
    data.tags?.forEach((tag, i) => formData.append(`tags[${i}]`, tag));
    data.categories?.forEach((cat, i) => formData.append(`categories[${i}]`, cat));

    // SEO fields (flattened)
    formData.append('seo.title', data.seoTitle || '');
    formData.append('seo.description', data.description || '');

    formData.append('banner', data.banner instanceof File ? data.banner : data?.banner?.url || '');

    if (blogData) {
      formData.append('id', blogData.id);
      formData.append('refferenceId', blogData.refferenceId || '');
    }

    const isDraft = status === 'Draft';

    if (isDraft) {
      startDraftTransition(async () => {
        const { error } = await saveDraft(formData);

        if (error) {
          enqueueSnackbar(error, { variant: 'error' });
          return;
        }

        enqueueSnackbar(`Blog has been ${blogData ? 'updated' : 'drafted'}.`, { variant: 'success' });
        router.push('/blog');
      });
    } else {
      startBlogTransition(async () => {
        const { error } = await savePublish(formData);

        if (error) {
          enqueueSnackbar(error, { variant: 'error' });
          return;
        }

        enqueueSnackbar(`Blog has been ${blogData ? 'updated' : 'published'}.`, { variant: 'success' });
        router.push('/blog');
      });
    }
  };

  // Blog preview handle
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    triggerFunction: () => {
      setOpen(true);
    }
  }));

  // Changes descard and exit handle
  const [openExitDialog, setOpenExitAlertDialog] = useState(false);

  const handleCancelAction = () => {
    if (isDirty) {
      setOpenExitAlertDialog(true);
    } else {
      router.push('/blog');
    }
  };

  const handleExitAlertClose = () => {
    setOpenExitAlertDialog(false);
  };

  const handleExitAlertDiscard = () => {
    setOpenExitAlertDialog(false);
    router.push('/blog');
  };

  const handleExitAlertSave = () => {
    setOpenExitAlertDialog(false);
    setIsPublishing(false);
    handleSubmit((data) => onSubmit('Draft')(data))();
  };

  useEffect(() => {
    const convertBanner = async () => {
      const banner = formValues.banner;
      if (banner instanceof File) {
        const base64 = await getBase64(banner);
        setPreviewBanner({ name: banner.name, size: banner.size, url: base64 });
      } else if (banner && 'url' in banner) {
        setPreviewBanner(banner);
      } else {
        setPreviewBanner({ name: '', size: 0, url: '' });
      }
    };

    convertBanner();
  }, [formValues.banner]);

  // Blog preview dialog
  const blogDialog = useMemo(() => {
    const previewData = {
      banner: previewBanner,
      title: formValues.title,
      caption: formValues.caption,
      content: formValues.content,
      tags: formValues.tags,
      categories: formValues.categories
    };
    return <BlogPreview {...{ blogData: previewData, open, handleClose: () => setOpen(false) }} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <MainCard sx={{ p: 0 }}>
      <Grid container>
        {/* ml put for grid manage because of divider */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ ml: '-1px' }}>
          <Stack sx={{ height: 1, gap: 3, p: 3, justifyContent: 'space-between' }}>
            <Stack sx={{ gap: 3 }}>
              <Typeset heading="Content" caption="Write a unique blog content" />
              <ReactQuill control={control} placeholder="Add your blog content" contentMinHeight={600} rules={contentSchema} />
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Button color="secondary" size="small" onClick={handleCancelAction} disabled={isBlogProcessing || isDraftProcessing}>
                Cancel
              </Button>
              <Stack direction="row" sx={{ gap: 1 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ textTransform: 'none' }}
                  disabled={!isDirty || isBlogProcessing}
                  {...(isDraftProcessing && { loading: true, loadingPosition: 'end' })}
                  onClick={() => {
                    setIsPublishing(false);
                    handleSubmit((data) => onSubmit('Draft')(data))();
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={(!blogData?.isDraft && !isDirty) || isDraftProcessing}
                  {...(isBlogProcessing && { loading: true, loadingPosition: 'end' })}
                  onClick={() => {
                    setIsPublishing(true);
                    handleSubmit((data) => onSubmit('Published')(data))();
                  }}
                >
                  {blogData ? 'Publish Changes' : 'Publish'}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Divider {...(!downMD ? { orientation: 'vertical', flexItem: true } : { sx: { width: 1 } })} />
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ p: 3 }}>
            <Stack sx={{ gap: 2.5 }}>
              <Typography variant="subtitle1">Content</Typography>
              <Stack sx={{ gap: 2 }}>
                <Box>
                  <InputLabel>Title</InputLabel>
                  <Controller
                    name="title"
                    control={control}
                    rules={titleSchema}
                    render={({ field }) => (
                      <OutlinedInput
                        {...field}
                        fullWidth
                        placeholder="Enter blog title"
                        error={!!errors.title}
                        onBlur={trimOnBlur(field.onBlur, field.onChange)}
                      />
                    )}
                  />
                  {errors.title?.message && <FormHelperText error>{errors.title?.message}</FormHelperText>}
                </Box>
                <Box>
                  <InputLabel>Slug</InputLabel>
                  <Controller
                    name="slug"
                    control={control}
                    rules={slugSchema}
                    render={({ field }) => (
                      <OutlinedInput
                        {...field}
                        fullWidth
                        placeholder="Enter blog slug"
                        error={!!errors.slug}
                        onBlur={trimOnBlur(field.onBlur, field.onChange)}
                      />
                    )}
                  />
                  {errors.slug?.message && <FormHelperText error>{errors.slug?.message}</FormHelperText>}
                </Box>
                <Box>
                  <OptionalFieldLabel label="Caption" />
                  <Controller
                    name="caption"
                    control={control}
                    render={({ field }) => (
                      <OutlinedInput
                        {...field}
                        placeholder="Add blog caption"
                        multiline
                        minRows={5}
                        fullWidth
                        error={errors.caption && Boolean(errors.caption)}
                        onBlur={trimOnBlur(field.onBlur, field.onChange)}
                      />
                    )}
                  />
                </Box>
                <Box>
                  <OptionalFieldLabel label="Tags" />
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        id="tags"
                        // No predefined options
                        options={[]}
                        freeSolo
                        onChange={(_, newValue) => {
                          const cleanedValues = newValue
                            .map((val) => (typeof val === 'string' ? val.trim() : ''))
                            .filter((val) => val !== '');
                          field.onChange(cleanedValues);
                        }}
                        renderValue={(value, getItemProps) =>
                          value.map((option, index) => {
                            const { key, ...tagProps } = getItemProps({ index });
                            return <Chip variant="tag" size="small" label={option} key={key} {...tagProps} />;
                          })
                        }
                        renderInput={(params) => <TextField variant="outlined" {...params} placeholder="Tags" error={!!errors.tags} />}
                      />
                    )}
                  />
                  {errors.tags?.message && <FormHelperText error>{errors.tags?.message}</FormHelperText>}
                </Box>
                <Box>
                  <InputLabel>Category</InputLabel>
                  <Controller
                    name="categories"
                    control={control}
                    rules={categorySchema}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        options={categoryOptions}
                        disableCloseOnSelect
                        onChange={(_, newValue) => field.onChange(newValue)}
                        getOptionLabel={(option) => option}
                        isOptionEqualToValue={(option, value) => option === value}
                        slotProps={{ chip: { clickable: true, variant: 'tag', size: 'small', sx: { margin: 0.25 } } }}
                        renderOption={({ key: optionKey, ...optionProps }, option, { selected }) => (
                          <li key={optionKey} {...optionProps}>
                            <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
                              <Checkbox checked={selected} sx={{ p: 0 }} />
                              {option}
                            </Stack>
                          </li>
                        )}
                        renderInput={(params) => <TextField {...params} placeholder="Select Items" error={!!errors.categories} />}
                      />
                    )}
                  />
                  {errors.categories?.message && <FormHelperText error>{errors.categories?.message}</FormHelperText>}
                </Box>
              </Stack>
            </Stack>
          </Box>
          <Divider />
          <Stack sx={{ gap: 2.5, p: 3 }}>
            <Typography variant="subtitle1">SEO</Typography>
            <Stack sx={{ gap: 2 }}>
              <Box>
                <InputLabel>Title</InputLabel>
                <Controller
                  name="seoTitle"
                  control={control}
                  rules={seoTitleSchema}
                  render={({ field }) => (
                    <OutlinedInput
                      {...field}
                      fullWidth
                      placeholder="Enter blog title"
                      error={!!errors.seoTitle}
                      onBlur={trimOnBlur(field.onBlur, field.onChange)}
                    />
                  )}
                />
                {errors.seoTitle?.message && <FormHelperText error>{errors.seoTitle?.message}</FormHelperText>}
              </Box>
              <Box>
                <OptionalFieldLabel label="Description" />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      {...field}
                      placeholder="Enter a description"
                      multiline
                      minRows={5}
                      fullWidth
                      error={errors.description && Boolean(errors.description)}
                      onBlur={trimOnBlur(field.onBlur, field.onChange)}
                    />
                  )}
                />
              </Box>
              <Box>
                <InputLabel>Cover Image</InputLabel>
                <SingleFileUpload control={control} name="banner" accept={{ 'image/*': [] }} rules={bannerSchema} />
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      {blogDialog}
      <DialogExitAlert
        open={openExitDialog}
        title={dialogExitData.title}
        heading={dialogExitData.heading}
        actionProps={{ children: 'Save as Draft', sx: { textTransform: 'none' } }}
        onClose={handleExitAlertClose}
        onDiscard={handleExitAlertDiscard}
        onSave={handleExitAlertSave}
      />
    </MainCard>
  );
}

OptionalFieldLabel.propTypes = { label: PropTypes.string };

BlogPost.propTypes = { preview: PropTypes.bool, setPreview: PropTypes.func, blogData: PropTypes.any, ref: PropTypes.object };
