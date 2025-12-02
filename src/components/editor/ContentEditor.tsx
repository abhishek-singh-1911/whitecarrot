'use client';

import {
  Box,
  Typography,
  Paper,
  IconButton,
  TextField,
  Stack,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';

interface Section {
  type: 'hero' | 'text' | 'video' | 'gallery';
  title: string;
  content: string;
  image_url?: string;
  order: number;
}

interface ContentEditorProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

export default function ContentEditor({ sections, onChange }: ContentEditorProps) {

  const handleAddSection = () => {
    const newSection: Section = {
      type: 'text',
      title: 'New Section',
      content: 'Add your content here...',
      order: sections.length,
    };
    onChange([...sections, newSection]);
  };

  const handleRemoveSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    onChange(newSections);
  };

  const handleUpdateSection = (index: number, field: keyof Section, value: any) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    onChange(newSections);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Page Content
      </Typography>

      <Stack spacing={2}>
        {sections.map((section, index) => (
          <Accordion key={index} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                <DragIcon color="action" />
                <Typography fontWeight="500">
                  {section.title || 'Untitled Section'} ({section.type})
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  select
                  label="Section Type"
                  value={section.type}
                  onChange={(e) => handleUpdateSection(index, 'type', e.target.value)}
                  fullWidth
                >
                  <MenuItem value="hero">Hero Banner</MenuItem>
                  <MenuItem value="text">Text Block</MenuItem>
                  <MenuItem value="video">Video Embed</MenuItem>
                  <MenuItem value="gallery">Image Gallery</MenuItem>
                </TextField>

                <TextField
                  label="Title"
                  value={section.title}
                  onChange={(e) => handleUpdateSection(index, 'title', e.target.value)}
                  fullWidth
                />

                <TextField
                  label="Content / Description"
                  value={section.content}
                  onChange={(e) => handleUpdateSection(index, 'content', e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                />

                {(section.type === 'hero' || section.type === 'gallery') && (
                  <TextField
                    label="Image URL"
                    value={section.image_url || ''}
                    onChange={(e) => handleUpdateSection(index, 'image_url', e.target.value)}
                    fullWidth
                    placeholder="https://example.com/image.jpg"
                  />
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleRemoveSection(index)}
                  >
                    Remove Section
                  </Button>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddSection}
        fullWidth
        sx={{ mt: 2, borderStyle: 'dashed' }}
      >
        Add Content Section
      </Button>
    </Box>
  );
}
