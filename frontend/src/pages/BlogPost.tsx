import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Breadcrumbs,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { publicService } from '../services/publicService';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => publicService.getBlogPostBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Blog Post Not Found</Typography>
        <Button component={Link} to="/blog" startIcon={<ArrowBackIcon />}>
          Back to Blog
        </Button>
      </Container>
    );
  }

  const tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags || [];

  return (
    <>
      <Helmet>
        <title>{post.title} - HVAC Company Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <Box sx={{ py: 4 }}>
        <Container maxWidth="md">
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 4 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            <Link to="/blog" style={{ textDecoration: 'none', color: 'inherit' }}>Blog</Link>
            <Typography color="text.primary">{post.title}</Typography>
          </Breadcrumbs>

          {/* Header */}
          <Typography variant="h3" component="h1" fontWeight={700} sx={{ mb: 2 }}>
            {post.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {post.publishDate && format(new Date(post.publishDate), 'MMMM d, yyyy')}
            </Typography>
            {post.authorFirstName && (
              <Typography variant="body2" color="text.secondary">
                By {post.authorFirstName} {post.authorLastName}
              </Typography>
            )}
          </Box>

          {/* Featured Image */}
          {post.featuredImage && (
            <Box
              component="img"
              src={post.featuredImage}
              alt={post.title}
              sx={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'cover',
                borderRadius: 2,
                mb: 4,
              }}
            />
          )}

          {/* Content */}
          <Box
            sx={{
              '& h2': { mt: 4, mb: 2, fontWeight: 600 },
              '& h3': { mt: 3, mb: 2, fontWeight: 600 },
              '& p': { mb: 2, lineHeight: 1.8 },
              '& ul, & ol': { mb: 2, pl: 3 },
              '& li': { mb: 1 },
            }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          {/* Tags */}
          {tags.length > 0 && (
            <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Tags:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags.map((tag: string, index: number) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </Box>
            </Box>
          )}

          {/* Back Button */}
          <Box sx={{ mt: 4 }}>
            <Button component={Link} to="/blog" startIcon={<ArrowBackIcon />}>
              Back to Blog
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default BlogPost;
