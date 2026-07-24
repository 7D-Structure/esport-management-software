-- AlterEnum
-- Insert MANAGER above COACH in the role hierarchy.
ALTER TYPE "UserRole" ADD VALUE 'MANAGER' BEFORE 'COACH';
