'use client';

import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CompanyPageRendererProps {
  company: {
    name: string;
    logo_url?: string;
    theme: {
      primaryColor: string;
      backgroundColor: string;
      font: string;
      titleColor?: string;
      bodyColor?: string;
      buttonTextColor?: string;
    };
    content_sections: Array<{
      type: 'hero' | 'text' | 'video' | 'gallery';
      title: string;
      content: string;
      image_url?: string;
      video_url?: string;
    }>;
  };
  showOpenRolesButton?: boolean;
}

export default function CompanyPageRenderer({ company, showOpenRolesButton = true }: CompanyPageRendererProps) {
  const { theme } = company;

  return (
    <Box sx={{
      backgroundColor: theme.backgroundColor,
      minHeight: '100vh',
      fontFamily: theme.font,
      color: theme.bodyColor || '#1f2937'
    }}>
      {/* Header */}
      <Box component="header" sx={{ py: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {company.logo_url ? (
              <img src={company.logo_url} alt={company.name} style={{ height: 40 }} />
            ) : (
              <Typography variant="h5" fontWeight="700" sx={{ color: theme.primaryColor }}>
                {company.name}
              </Typography>
            )}
            {showOpenRolesButton && (
              <Button
                variant="contained"
                onClick={() => {
                  const element = document.getElementById('open-roles');
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                sx={{
                  backgroundColor: theme.primaryColor,
                  color: theme.buttonTextColor || '#ffffff',
                  '&:hover': { backgroundColor: theme.primaryColor, filter: 'brightness(0.9)' }
                }}
              >
                View Open Roles
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Sections */}
      {company.content_sections.map((section, index) => {
        switch (section.type) {
          case 'hero':
            return (
              <Box key={index} sx={{
                py: 10,
                textAlign: 'center',
                backgroundColor: index === 0 ? 'rgba(0,0,0,0.02)' : 'transparent'
              }}>
                <Container maxWidth="md">
                  <Typography variant="h2" fontWeight="800" gutterBottom sx={{ color: theme.titleColor || '#111827' }}>
                    {section.title}
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4, maxWidth: 600, mx: 'auto', color: theme.bodyColor || 'text.secondary' }}>
                    {section.content}
                  </Typography>
                  {section.image_url && (
                    <Box
                      component="img"
                      src={section.image_url}
                      alt="Hero"
                      sx={{
                        width: '100%',
                        borderRadius: 4,
                        mt: 4,
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  )}
                </Container>
              </Box>
            );

          case 'text':
            return (
              <Container key={index} maxWidth="md" sx={{ py: 8 }}>
                <Typography variant="h3" fontWeight="700" gutterBottom sx={{ color: theme.titleColor || '#111827' }}>
                  {section.title}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.125rem', lineHeight: 1.75, color: theme.bodyColor || '#4b5563' }}>
                  {section.content}
                </Typography>
              </Container>
            );

          case 'video':
            return (
              <Box key={index} sx={{ py: 8, backgroundColor: index === 0 ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
                <Container maxWidth="lg">
                  <Typography variant="h3" fontWeight="700" textAlign="center" gutterBottom sx={{ color: theme.titleColor || '#111827' }}>
                    {section.title}
                  </Typography>
                  <Typography textAlign="center" sx={{ mb: 4, color: theme.bodyColor || 'text.secondary' }}>
                    {section.content}
                  </Typography>
                  <Box sx={{
                    position: 'relative',
                    paddingTop: '56.25%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}>
                    {section.video_url ? (
                      <iframe
                        src={section.video_url}
                        title={section.title}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none'
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography color="text.secondary">Add a video URL to display content</Typography>
                      </Box>
                    )}
                  </Box>
                </Container>
              </Box>
            );

          default:
            return null;
        }
      })}

      {/* Footer */}
      <Box component="footer" sx={{ py: 6, borderTop: '1px solid rgba(0,0,0,0.1)', mt: 8 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography color="text.secondary">
            &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
