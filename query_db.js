import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yqjzoomuqbbhbjcnrdif.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxanpvb211cWJiaGJqY25yZGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjcxMjUsImV4cCI6MjA5NTQ0MzEyNX0.88EIxwoPIJa85wXd_DA0ORbDPROtu32xJ6Gxtc7R_jI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('tuition_fees')
    .select('*');
  
  if (error) {
    console.error('Error fetching tuition_fees:', error);
  } else {
    console.log('tuition_fees data:', JSON.stringify(data, null, 2));
  }

  const { data: students, error: sError } = await supabase
    .from('students')
    .select('*');
  
  if (sError) {
    console.error('Error fetching students:', sError);
  } else {
    console.log('students data:', JSON.stringify(students, null, 2));
  }
}

main();
