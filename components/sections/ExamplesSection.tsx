import React from 'react';

export const ExamplesSection: React.FC = () => {
  const examples = [
    {
      title: 'Multi-Language API Integration',
      role: '🌐 Web Development',
      before: 'mujhe jwt auth implementation seekhna hai nextjs server actions ke sath',
      after: `[ROLE & PERSONA]\nPrincipal Web Architect & Next.js Security Expert\n\n[OBJECTIVE & SCOPE]\nDesign and implement a secure, stateless JWT Authentication system using Next.js Server Actions and Middleware.\n\n[CORE RULES & TECHNICAL CONSTRAINTS]\n- Implement JWT token signing, verification, and rotation.\n- Secure client-side and server-side routes using Next.js Middleware edge runtime.\n- Store tokens securely in HttpOnly, SameSite, Secure cookies.\n- Handle token expiration, renewal, and clean error states.\n\n[EXPECTED OUTPUT FORMAT]\nA comprehensive file-by-file blueprint (Middleware, Login Server Action, and Session Helper) with code examples in TypeScript.`,
    },
    {
      title: 'React Performance Optimization',
      role: '💻 Software Developer',
      before: 'optimise large table render in react list is slow with 10k items',
      after: `[ROLE & PERSONA]\nSenior Frontend Performance Engineer\n\n[OBJECTIVE & SCOPE]\nRefactor a slow React table component rendering 10,000+ items to achieve 60fps rendering and smooth scrolling.\n\n[CORE RULES & TECHNICAL CONSTRAINTS]\n- Implement DOM virtualization (windowing) using react-window or custom hook.\n- Minimize re-renders using React.memo, useMemo, and useCallback.\n- Use CSS container queries and GPU-accelerated translate3d.\n- Profile memory usage and prevent event listener leaks.\n\n[EXPECTED OUTPUT FORMAT]\nOptimized React/TypeScript source code with virtualization logic, accompanied by a performance profiling summary.`,
    },
    {
      title: 'High-Traffic Schema Design',
      role: '📊 Data Science',
      before: 'design user analytics database schema in postgress for high traffic',
      after: `[ROLE & PERSONA]\nPrincipal Database Administrator & Data Architect\n\n[OBJECTIVE & SCOPE]\nCreate a highly performant PostgreSQL schema to store, query, and aggregate millions of real-time user event logs.\n\n[CORE RULES & TECHNICAL CONSTRAINTS]\n- Use PostgreSQL Table Partitioning by range (daily/weekly).\n- Optimize for high write throughput using appropriate indexes (BRIN/GIN).\n- Implement transactional integrity and denormalized rollup tables for quick reports.\n- Ensure efficient data retention policies and query isolation.\n\n[EXPECTED OUTPUT FORMAT]\nStructured SQL DDL scripts with partition definitions, index creation, and sample query optimization execution plans.`,
    },
    {
      title: 'DevOps Containerization',
      role: '💻 Software Developer',
      before: 'write dockerfile for nextjs and reduce size to under 150mb',
      after: `[ROLE & PERSONA]\nLead DevOps Architect & Container Security Specialist\n\n[OBJECTIVE & SCOPE]\nCreate a secure, multi-stage Dockerfile for a Next.js application that optimizes layer caching and minimizes image size.\n\n[CORE RULES & TECHNICAL CONSTRAINTS]\n- Implement multi-stage build separating dependencies, builder, and runner.\n- Leverage Next.js standalone output feature to exclude unnecessary node_modules.\n- Use a minimal base image (alpine or distroless) and enforce a non-root user.\n- Cache node_modules and build directories between pipeline runs.\n\n[EXPECTED OUTPUT FORMAT]\nProduction-ready Dockerfile and .dockerignore with detailed inline explanations for security and size optimizations.`,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6 sm:space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Demonstration</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white transition-colors">Before & After Examples</h2>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto transition-colors px-2">
          See how basic natural language inputs become structured, role-driven Pro prompts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {examples.map((ex, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 shadow-md dark:shadow-2xl transition-all"
          >
            <div className="space-y-3">
              {/* HEADER WITH MIN-HEIGHT FOR FLEXIBLE RESPONSIVE ALIGNMENT */}
              <div className="min-h-[2.75rem] flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider truncate">
                  {ex.title}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex-shrink-0">
                  {ex.role}
                </span>
              </div>

              {/* BEFORE SECTION WITH MIN-HEIGHT FOR FLEXIBLE RESPONSIVE ALIGNMENT */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">BEFORE</span>
                <div className="min-h-[3.25rem] flex items-center p-2.5 rounded-xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-400 leading-snug break-words">
                  "{ex.before}"
                </div>
              </div>

              {/* AFTER SECTION WITH AFTER ENHANCEMENT BREAK-WORDS */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider block">AFTER ENHANCEMENT</span>
                <div className="h-52 sm:h-56 text-[11px] font-mono text-zinc-100 bg-zinc-950 dark:bg-black border border-zinc-800 dark:border-zinc-800 p-3 rounded-xl leading-relaxed whitespace-pre-wrap shadow-inner overflow-y-auto break-words">
                  {ex.after}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
