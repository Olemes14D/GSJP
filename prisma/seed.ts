// prisma/seed.ts
import { PrismaClient, Role, ArticleType, SubmissionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Nettoyer la base de données
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.review.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.editorialBoard.deleteMany();
  await prisma.user.deleteMany();

  // Hasher les mots de passe
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Créer des utilisateurs
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gsjpediatrics.org',
      password: hashedPassword,
      fullName: 'Admin User',
      role: Role.ADMIN,
      institution: 'GSJP Editorial Office',
      country: 'Benin',
    },
  });

  const editor = await prisma.user.create({
    data: {
      email: 'editor@gsjpediatrics.org',
      password: hashedPassword,
      fullName: 'Prof. Amina Diallo',
      role: Role.EDITOR,
      institution: 'Université Cheikh Anta Diop',
      country: 'Senegal',
      specialties: JSON.stringify(['Pediatric Infectious Diseases', 'Tropical Medicine']),
    },
  });

  const reviewer1 = await prisma.user.create({
    data: {
      email: 'reviewer1@example.com',
      password: hashedPassword,
      fullName: 'Dr. Carlos Mendoza',
      role: Role.REVIEWER,
      institution: 'Universidad Nacional de Colombia',
      country: 'Colombia',
      specialties: JSON.stringify(['Neonatology', 'Pediatric Cardiology']),
    },
  });

  const author1 = await prisma.user.create({
    data: {
      email: 'author@example.com',
      password: hashedPassword,
      fullName: 'Dr. Marie Kouassi',
      role: Role.AUTHOR,
      institution: 'CHU de Cocody',
      country: 'Ivory Coast',
      specialties: JSON.stringify(['Pediatric Nutrition']),
    },
  });

  console.log('✅ Users created');

  // Créer le comité éditorial
  await prisma.editorialBoard.create({
    data: {
      userId: editor.id,
      boardRole: 'EDITOR_IN_CHIEF',
      bio: 'Expert in pediatric infectious diseases with 20+ years of experience in West Africa.',
      displayOrder: 1,
    },
  });

  console.log('✅ Editorial board created');

  // Créer des soumissions de test
  const submission1 = await prisma.submission.create({
    data: {
      authorId: author1.id,
      title: 'Prevalence of Malnutrition in Children Under 5 in West Africa: A Systematic Review',
      abstract: 'Background: Malnutrition remains a major public health challenge in West Africa...',
      keywords: JSON.stringify(['malnutrition', 'West Africa', 'children', 'systematic review']),
      articleType: ArticleType.SYSTEMATIC_REVIEW,
      status: SubmissionStatus.SUBMITTED,
      wordCount: 5200,
      correspondingAuthor: JSON.stringify({
        name: 'Dr. Marie Kouassi',
        email: 'author@example.com',
        institution: 'CHU de Cocody',
      }),
    },
  });

  console.log('✅ Submissions created');

  // Créer des reviews
  await prisma.review.create({
    data: {
      submissionId: submission1.id,
      reviewerId: reviewer1.id,
      status: 'INVITED',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 jours
    },
  });

  console.log('✅ Reviews created');

  // Créer des notifications
  await prisma.notification.create({
    data: {
      userId: author1.id,
      type: 'SUBMISSION_RECEIVED',
      title: 'Submission Received',
      message: 'Your manuscript has been successfully submitted and is under review.',
      link: `/dashboard/author/submissions/${submission1.id}`,
    },
  });

  console.log('✅ Notifications created');

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Test accounts:');
  console.log('Admin: admin@gsjpediatrics.org / password123');
  console.log('Editor: editor@gsjpediatrics.org / password123');
  console.log('Reviewer: reviewer1@example.com / password123');
  console.log('Author: author@example.com / password123');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });