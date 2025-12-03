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
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Section {
  type: 'hero' | 'text' | 'video' | 'gallery';
  title: string;
  content: string;
  image_url?: string;
  gallery_images?: string[];
  video_url?: string;
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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    onChange(updatedItems);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Page Content
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <Stack
              spacing={2}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {sections.map((section, index) => (
                <Draggable key={index} draggableId={`section-${index}`} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <Accordion defaultExpanded={index === 0}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                            <Box {...provided.dragHandleProps} sx={{ display: 'flex', alignItems: 'center', cursor: 'grab' }}>
                              <DragIcon color="action" />
                            </Box>
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

                            {section.type === 'hero' && (
                              <TextField
                                label="Image URL"
                                value={section.image_url || ''}
                                onChange={(e) => handleUpdateSection(index, 'image_url', e.target.value)}
                                fullWidth
                                placeholder="https://example.com/image.jpg"
                              />
                            )}

                            {section.type === 'gallery' && (
                              <Stack spacing={2}>
                                <Typography variant="subtitle2">Gallery Images</Typography>
                                {(section.gallery_images || []).map((url, imgIndex) => (
                                  <Stack key={imgIndex} direction="row" spacing={1}>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      value={url}
                                      onChange={(e) => {
                                        const newImages = [...(section.gallery_images || [])];
                                        newImages[imgIndex] = e.target.value;
                                        handleUpdateSection(index, 'gallery_images', newImages);
                                      }}
                                      placeholder="Image URL"
                                    />
                                    <IconButton
                                      color="error"
                                      onClick={() => {
                                        const newImages = (section.gallery_images || []).filter((_, i) => i !== imgIndex);
                                        handleUpdateSection(index, 'gallery_images', newImages);
                                      }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Stack>
                                ))}
                                <Button
                                  startIcon={<AddIcon />}
                                  onClick={() => {
                                    const newImages = [...(section.gallery_images || []), ''];
                                    handleUpdateSection(index, 'gallery_images', newImages);
                                  }}
                                >
                                  Add Image
                                </Button>
                              </Stack>
                            )}

                            {section.type === 'video' && (
                              <TextField
                                label="Video URL"
                                value={section.video_url || ''}
                                onChange={(e) => handleUpdateSection(index, 'video_url', e.target.value)}
                                fullWidth
                                placeholder="YouTube or Vimeo embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)"
                                helperText="Use the embed URL, not the regular video link"
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
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>

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
