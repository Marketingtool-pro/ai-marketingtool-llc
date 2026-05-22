// @project
import { profiles } from './profile';
import { offsetDate } from '@/utils/offsetDate';

// @assets
import blog1 from '@/assets/images/blog/1.jpg';
import blog2 from '@/assets/images/blog/2.jpg';
import blog3 from '@/assets/images/blog/3.jpg';
import blog4 from '@/assets/images/blog/4.jpg';
import blog5 from '@/assets/images/blog/5.jpg';
import blog6 from '@/assets/images/blog/6.jpg';
import blog7 from '@/assets/images/blog/7.jpg';
import blog8 from '@/assets/images/blog/8.jpg';

export const categoryOptions = ['Technology', 'Business', 'Finance', 'Design', 'Product', 'Management'];

export const statusOptions = ['Published', 'Archived'];

export const draftOptions = ['Drafted', 'Not Drafted'];

const blogDescription = `<h2><strong>Introduction</strong></h2><p>Digital art has rapidly gained prominence in recent years. It has revolutionised the way we perceive and create art, making it more accessible and diverse.</p><p><br></p><h2><strong>Digital Arts Impact on Media</strong></h2><p>Digital art is reshaping traditional media forms. Artists use technology to create stunning visuals for films, video games, and advertising, enhancing storytelling and engagement.</p><p><br></p><h2>New Forms of Expression</h2><p>The digital medium offers new tools for creativity. Artists can experiment with virtual reality, 3D modelling, and animation, pushing the boundaries of traditional art forms.</p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Virtual Reality (VR): Enables immersive storytelling and interactive experiences, allowing artists to create entire virtual worlds.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>3D Modeling: Provides tools to sculpt and design three-dimensional objects, which can be used for digital sculptures, architecture, or product design.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Animation: Allows for dynamic storytelling through movement, creating engaging visual narratives that are impossible with static media.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Augmented Reality (AR): Blends the digital and physical worlds, enhancing real-life surroundings with interactive digital elements.</li></ol><p><br></p><h2>Challenges and Opportunities</h2><p>Digital art presents both challenges and opportunities. While it democratizes art creation, it also raises questions about originality and copyright in the digital age.</p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Technical Expertise</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Cost of Technology</li></ol>`;

export const blogs = [
  {
    id: '1',
    refferenceId: '',
    banner: { name: 'blog1.jpg', size: 45382, url: blog1 },
    title: 'AI Revolutionizing industries, one data-driven step at a time',
    caption: `Exploring AI's transformative role in reshaping industries through automation and data insights.`,
    content: blogDescription,
    profile: profiles[0],
    tags: ['react', 'react-template', 'webdev', 'dashboard'],
    categories: [categoryOptions[1], categoryOptions[0]],
    seo: {
      title: 'AI Revolutionizing industries, one data-driven step at a time',
      description: `Exploring AI's transformative role in reshaping industries through automation and data insights.`
    },
    slug: 'ai-revolutionizing-industries-one-data-driven-step-at-a-time',
    visits: 32,
    createdDate: offsetDate(-7),
    isArchived: true,
    isDraft: false
  },
  {
    id: '2',
    refferenceId: '',
    banner: { name: 'blog2.jpg', size: 86913, url: blog2 },
    title: 'Innovative technologists: Crafting the future with creativity',
    caption: 'Showcasing visionaries at the forefront of technological progress and innovation.',
    content: blogDescription,
    profile: profiles[1],
    tags: ['react', 'react-template', 'webdev', 'dashboard'],
    categories: [categoryOptions[2], categoryOptions[5]],
    seo: {
      title: 'Innovative technologists: Crafting the future with creativity',
      description: 'Showcasing visionaries at the forefront of technological progress and innovation.'
    },
    slug: 'innovative-technologists-crafting-the-future-with-creativity',
    createdDate: offsetDate(-22),
    isArchived: true,
    isDraft: true
  },
  {
    id: '3',
    refferenceId: '',
    banner: { name: 'blog3.jpg', size: 129633, url: blog3 },
    title: 'Embracing calm in a whirlwind of activity',
    caption: `Discussing the importance and benefits of mindfulness practices in today's busy lifestyle.`,
    content: blogDescription,
    profile: profiles[3],
    tags: ['react', 'react-template', 'webdev', 'dashboard'],
    categories: [categoryOptions[3]],
    seo: {
      title: 'Embracing calm in a whirlwind of activity',
      description: `Discussing the importance and benefits of mindfulness practices in today's busy lifestyle.`
    },
    slug: 'embracing-calm-in-a-whirlwind-of-activity',
    visits: 23,
    createdDate: offsetDate(-6),
    isArchived: false,
    isDraft: false
  },
  {
    id: '4',
    refferenceId: '',
    banner: { name: 'blog4.jpg', size: 101049, url: blog4 },
    title: 'Digital art: A pillar of modern culture',
    caption:
      'Exploring how digital art is becoming a significant part of contemporary culture, influencing various forms of media and expression.',
    content: blogDescription,
    profile: profiles[4],
    tags: ['angular', 'angular-template', 'webdev', 'dashboard'],
    categories: [categoryOptions[0], categoryOptions[2]],
    seo: {
      title: 'Digital art: A pillar of modern culture',
      description:
        'Exploring how digital art is becoming a significant part of contemporary culture, influencing various forms of media and expression.'
    },
    slug: 'digital-art-a-pillar-of-modern-culture',
    visits: 12,
    createdDate: offsetDate(-21),
    isArchived: false,
    isDraft: false
  },
  {
    id: '5',
    refferenceId: '',
    banner: { name: 'blog5.jpg', size: 123757, url: blog5 },
    title: 'Street fashion: Redefining urban identity',
    caption: 'A look at the impact of street fashion on the identity and culture of urban communities around the world.',
    content: blogDescription,
    profile: profiles[5],
    tags: ['angular', 'angular-template', 'webdev', 'dashboard'],
    categories: [categoryOptions[4]],
    seo: {
      title: 'Street fashion: Redefining urban identity',
      description: 'A look at the impact of street fashion on the identity and culture of urban communities around the world.'
    },
    slug: 'street-fashion-redefining-urban-identity',
    visits: 13,
    createdDate: offsetDate(-5),
    isArchived: false,
    isDraft: false
  },
  {
    id: '6',
    refferenceId: '',
    banner: { name: 'blog6.jpg', size: 110484, url: blog6 },
    title: 'Eco-friendly living: Tiny steps, transformative outcomes',
    caption: 'Focusing on small actions that drive big progress in sustainability.',
    content: blogDescription,
    profile: profiles[6],
    tags: ['angular', 'angular-template', 'webdev', 'dashboard'],
    categories: [categoryOptions[1], categoryOptions[3]],
    seo: {
      title: 'Eco-friendly living: Tiny steps, transformative outcomes',
      description: 'Focusing on small actions that drive big progress in sustainability.'
    },
    slug: 'eco-friendly-living-tiny-steps-transformative-outcomes',
    visits: 24,
    createdDate: offsetDate(-18),
    isArchived: true,
    isDraft: false
  },
  {
    id: '7',
    refferenceId: '',
    banner: { name: 'blog7.jpg', size: 785758, url: blog7 },
    title: 'Unsung heroes: Transforming communities with courage',
    caption: 'Honoring everyday individuals who make a remarkable impact on their communities.',
    content: blogDescription,
    profile: profiles[7],
    tags: ['react', 'react-template', 'webdev', 'dashboard'],
    categories: [categoryOptions[2]],
    seo: {
      title: 'Unsung heroes: Transforming communities with courage',
      description: 'Honoring everyday individuals who make a remarkable impact on their communities.'
    },
    slug: 'unsung-heroes-transforming-communities-with-courage',
    visits: 12,
    createdDate: offsetDate(-10),
    isArchived: false,
    isDraft: false
  },
  {
    id: '8',
    refferenceId: '',
    banner: { name: 'blog8.jpg', size: 164680, url: blog8 },
    title: 'The future of smart homes: Convenience or intrusion?',
    caption: 'An exploration of the advantages and privacy challenges of smart home technology.',
    content: blogDescription,
    profile: profiles[8],
    tags: ['angular', 'angular-template', 'webdev', 'dashboard'],
    categories: [categoryOptions[0], categoryOptions[3]],
    seo: {
      title: 'The future of smart homes: Convenience or intrusion?',
      description: 'An exploration of the advantages and privacy challenges of smart home technology.'
    },
    slug: 'the-future-of-smart-homes-convenience-or-intrusion',
    visits: 13,
    createdDate: offsetDate(-12),
    isArchived: false,
    isDraft: false
  },
  {
    id: '9',
    refferenceId: '1',
    title: '',
    caption: ``,
    content: blogDescription,
    profile: profiles[0],
    tags: ['react', 'react-template'],
    categories: [categoryOptions[1], categoryOptions[0]],
    seo: {
      title: 'AI Revolutionizing industries, one data-driven step at a time',
      description: `Exploring AI's transformative role in reshaping industries through automation and data insights.`
    },
    slug: 'ai-revolutionizing-industries',
    createdDate: new Date(),
    isArchived: false,
    isDraft: true
  },
  {
    id: '10',
    refferenceId: '5',
    banner: { name: 'blog5.jpg', size: 123757, url: blog5 },
    title: 'Street fashion: Redefining urban identity',
    caption: 'A look at the impact of street fashion on the identity and culture of urban communities around the world.',
    content: blogDescription,
    profile: profiles[5],
    tags: ['angular', 'angular-template', 'webdev', 'dashboard'],
    categories: [categoryOptions[4]],
    seo: {
      title: 'Street fashion: Redefining urban identity',
      description: 'A look at the impact of street fashion on the identity and culture of urban communities around the world.'
    },
    slug: 'street-fashion-redefining-urban-identity',
    createdDate: offsetDate(-5),
    isArchived: true,
    isDraft: true
  },
  {
    id: '11',
    refferenceId: '7',
    banner: { name: 'blog7.jpg', size: 785758, url: blog7 },
    title: 'Unsung heroes: Transforming communities with courage',
    caption: 'Honoring everyday individuals who make a remarkable impact on their communities.',
    content: blogDescription,
    profile: profiles[7],
    tags: ['react', 'react-template', 'webdev', 'dashboard'],
    categories: [categoryOptions[2]],
    seo: {
      title: 'Unsung heroes: Transforming communities with courage',
      description: 'Honoring everyday individuals who make a remarkable impact on their communities.'
    },
    slug: 'unsung-heroes-transforming-communities-with-courage',
    visits: 12,
    createdDate: offsetDate(-10),
    isArchived: false,
    isDraft: true
  }
];
