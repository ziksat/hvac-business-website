import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { publicService } from '../services/publicService';

const Blog: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => publicService.getBlogPosts(1, 12),
  });

  return (
    <>
      <Helmet>
        <title>HVAC Tips & News - Blog</title>
        <meta
          name="description"
          content="Read our HVAC blog for tips, seasonal advice, and the latest news in heating and cooling."
        />
      </Helmet>

      {/* Hero */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" fontWeight={700} sx={{ mb: 2 }}>
            HVAC Tips & News
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
            Stay informed with the latest HVAC tips, seasonal maintenance advice, and company news.
          </Typography>
        </Container>
      </Box>

      {/* Blog Posts */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {data?.posts.map((post) => {
                const tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags || [];
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={post.id}>
                    <Card 
                      component={Link} 
                      to={`/blog/${post.slug}`}
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        textDecoration: 'none',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)' }
                      }}
                    >
                      {post.featuredImage ? (
                        <CardMedia
                          component="img"
                          height="200"
                          image={post.featuredImage}
                          alt={post.title}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 200,
                            bgcolor: 'grey.200',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography color="text.secondary">No Image</Typography>
                        </Box>
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', mb: 1 }}
                        >
                          {post.publishDate && format(new Date(post.publishDate), 'MMMM d, yyyy')}
                        </Typography>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {post.excerpt}
                        </Typography>
                        {tags.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {tags.slice(0, 3).map((tag: string, index: number) => (
                              <Chip key={index} label={tag} size="small" />
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {data?.posts.length === 0 && !isLoading && (
            <Typography variant="h6" textAlign="center" color="text.secondary">
              No blog posts available yet. Check back soon!
            </Typography>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Blog;
