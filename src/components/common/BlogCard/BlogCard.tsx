import React from "react";
import { Link } from "react-router-dom";
import styles from "./BlogCard.module.css";

export interface BlogPost {
  id: number;
  title: string;
  excerpt?: string;
  image?: string;
  category?: string;
  author?: string;
  date?: string;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Link to={`/blog/${post.id}`} className={styles.card}>
      {post.image && (
        <div className={styles.imageContainer}>
          <img src={post.image} alt={post.title} className={styles.image} />
        </div>
      )}
      <div className={styles.content}>
        {post.category && (
          <span className={styles.category}>{post.category}</span>
        )}
        <h3 className={styles.title}>{post.title}</h3>
        {post.excerpt && (
          <p className={styles.excerpt}>{post.excerpt}</p>
        )}
        <div className={styles.meta}>
          {post.author && (
            <span className={styles.author}>{post.author}</span>
          )}
          {post.date && (
            <span className={styles.date}>{post.date}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;

