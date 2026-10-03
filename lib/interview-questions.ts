export type InterviewLanguage = "ar" | "en" | "fr" | "es" | "de";
export type InterviewType = "general" | "technical" | "hr" | "behavioral" | "management";
export type ExperienceLevel = "beginner" | "intermediate" | "senior";

export type InterviewInput = {
  jobTitle: string;
  company: string;
  industry: string;
  yearsExperience: string;
  level: ExperienceLevel;
  jobDescription: string;
  types: InterviewType[];
  count: number;
  language: InterviewLanguage;
  harder: boolean;
};

export type InterviewQuestion = {
  id: string;
  type: InterviewType;
  question: string;
  why: string;
  answer: string;
  tip: string;
  difficulty: "سهل" | "متوسط" | "صعب" | "Easy" | "Medium" | "Hard" | "Facile" | "Moyen" | "Difficile" | "Fácil" | "Medio" | "Difícil" | "Einfach" | "Mittel" | "Schwierig";
  isStar: boolean;
};

type CategoryCopy = {
  questions: string[];
  reasons: string[];
  tips: string[];
  answers: string[];
};

const WORD_STOP = new Set([
  "about", "after", "also", "and", "are", "can", "for", "from", "have", "how",
  "into", "more", "our", "that", "the", "their", "this", "with", "will", "you",
  "your", "what", "when", "where", "who", "why", "which", "role", "work",
  "job", "team", "years", "experience", "responsibilities", "requirements",
  "skills", "ability", "candidate", "required", "company", "position",
  "pour", "dans", "avec", "les", "des", "une", "qui", "vous", "nous", "sur",
  "comment", "votre", "vos", "poste", "équipe", "ans", "expérience", "compétences",
  "para", "con", "por", "una", "las", "los", "del", "que", "cómo", "sobre",
  "puesto", "equipo", "años", "experiencia", "habilidades", "cuando",
  "und", "mit", "der", "die", "das", "ein", "eine", "sie", "wir", "von",
  "ist", "wie", "was", "warum", "welche", "ihre", "team", "stelle", "erfahrung",
  "من", "في", "على", "إلى", "عن", "مع", "هذا", "هذه", "التي", "الذي", "كما",
  "لدى", "ضمن", "أو", "وهو", "وهي", "مطلوب", "المطلوب", "الوظيفة", "العمل",
  "المتقدم", "المتقدمين", "سنوات", "خبرة", "مهارات", "فريق", "للعمل", "لديكم",
]);

export function extractInterviewKeywords(description: string): string[] {
  const lower = description.toLocaleLowerCase();
  const terms = [...new Set(
    [...lower.matchAll(/\b[a-z][a-z0-9+#.-]*(?:\s+[a-z][a-z0-9+#.-]*){0,2}\b|[\u0600-\u06ff]{3,}(?:\s+[\u0600-\u06ff]{3,}){0,1}/g)]
      .map((match) => match[0].trim())
      .filter((term) => term.split(/\s+/).length > 1 || (!WORD_STOP.has(term) && term.length > 2)),
  )];
  const frequencies = new Map<string, number>();
  for (const term of terms) frequencies.set(term, (frequencies.get(term) ?? 0) + 1);
  return [...frequencies.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([term]) => term)
    .slice(0, 10);
}

const COPY: Record<InterviewLanguage, Record<InterviewType, CategoryCopy>> = {
  ar: {
    general: {
      questions: [
        "حدثني عن نفسك ومسارك المهني.",
        "لماذا تقدمت لوظيفة {role}؟",
        "ما الذي تعرفه عن {company}؟",
        "ما أبرز نقطة قوة ستفيدك في هذا الدور؟",
        "ما المهارة التي تعمل حاليًا على تطويرها؟",
        "ما الذي تبحث عنه في خطوتك المهنية القادمة؟",
      ],
      reasons: ["لفهم خلفيتك وكيف تلخص خبرتك بما يرتبط بالوظيفة.", "لقياس دافعك ومدى فهمك لمتطلبات الدور.", "لمعرفة مدى استعدادك واهتمامك بالجهة.", "لفهم القيمة العملية التي قد تضيفها للفريق.", "لاستكشاف وعيك بالتعلم والتطوير المهني.", "لفهم ما يحفزك ومدى توافق توقعاتك مع الدور."],
      tips: ["قدّم ملخصًا من 60 إلى 90 ثانية، واختم بما يربط خبرتك بالوظيفة.", "اربط إجابتك بمسؤولية محددة في الإعلان، وكن واقعيًا.", "اذكر معلومة محددة من بحثك عن الشركة بدل الثناء العام.", "اختر نقطة قوة واحدة وادعمها بمثال حقيقي.", "اذكر مهارة محددة وخطوة عملية تتخذها لتطويرها.", "ركّز على مسؤوليات وفرص تعلم متوافقة مع هذه الوظيفة."],
      answers: ["أنا {role}{years}. أركز في عملي على [مجالات أو مهام حقيقية]، وأبرز ما قدمته هو [مثال حقيقي]. أبحث الآن عن فرصة أستفيد فيها من {skills} في هذا الدور.", "تجذبني مسؤوليات {role}، وخصوصًا [مسؤولية محددة من الإعلان]. تتصل خبرتي في {skills} بهذا الجانب، وأود توظيفها في بيئة {company}.", "من خلال بحثي، لفت انتباهي [معلومة موثوقة عن الشركة أو منتجها]. وأرى صلة بين احتياج الدور في {keywords} وخبرتي في {skills}.", "من نقاط قوتي {skills}. استخدمتها في [موقف حقيقي]، وكانت النتيجة [نتيجة فعلية أو درس تعلمته].", "أعمل حاليًا على تطوير [مهارة محددة] من خلال [دورة أو تدريب أو ممارسة حقيقية]. أتابع تقدمي عبر [طريقة واضحة].", "أبحث عن فرصة أساهم فيها في {role}، وأتطور في [مجال واقعي]. جذبني هذا الدور لأنه يركز على {keywords}."],
    },
    technical: {
      questions: [
        "كيف ستتعامل مع تحدٍ تقني شائع في مجال {domain}؟",
        "كيف تختار الأداة أو الأسلوب الأنسب لحل مشكلة في {role}؟",
        "اشرح خطواتك عند تحليل خلل أو نتيجة غير متوقعة.",
        "كيف توازن بين السرعة والجودة في تسليم عملك؟",
        "ما الممارسات التي تتبعها لتوثيق عملك ومشاركته؟",
        "كيف تقيّم نجاح حل أو مشروع تقني؟",
        "ما تجربة تعلم تقنية جديدة وتطبيقها؟",
        "كيف تتعامل مع متطلبات تقنية غير واضحة؟",
      ],
      reasons: ["لقياس منهجك في حل مشكلات المجال، لا مجرد حفظ المصطلحات.", "لفهم طريقة تقييمك للخيارات والقيود العملية.", "للتعرف على منهجيتك في التشخيص والتحقق.", "لقياس قدرتك على الموازنة بين الإنجاز والموثوقية.", "لفهم تعاونك وقابلية عملك للصيانة أو المراجعة.", "لمعرفة كيف تربط الجانب التقني بأثر العمل.", "لاستكشاف قدرتك على التعلم وتطبيق المعرفة.", "لقياس كيفية تحويل الغموض إلى خطوات قابلة للتنفيذ."],
      tips: ["سمّ المشكلة والخطوات والأدوات التي تعرفها؛ لا تدّع خبرة لم تستخدمها.", "اشرح معايير الاختيار والبدائل والمفاضلات.", "رتّب الإجابة: إعادة الإنتاج، الفرضيات، الاختبار، ثم التحقق.", "اذكر الأولويات والمخاطر ومعيار الجودة الذي لا تتنازل عنه.", "قدّم مثالًا حقيقيًا عن توثيق أو مراجعة أو مشاركة معرفة.", "اربط المقياس التقني بحاجة المستخدم أو الفريق.", "استخدم مثالًا محددًا من تعلم حقيقي، حتى لو كان مشروعًا تدريبيًا.", "اسأل عن القيود، ثم وضح افتراضاتك وخطة التحقق."],
      answers: ["في مجال {domain}، أبدأ بتحديد المشكلة وسياقها ومتطلباتها. أتحقق من [خطوات أو أداة استخدمتها فعلًا]، ثم أقارن الحلول وفق [معايير واقعية]. في {role} سأوثق القرار وأقيس النتيجة عبر [مقياس مناسب].", "أحدد أولًا متطلبات المهمة والقيود، ثم أقارن الخيارات التي استخدمتها أو أعرفها مثل {keywords}. أختار بناءً على [الأداء أو الدقة أو قابلية الصيانة]، وأتحقق من القرار باختبار أو نتيجة قابلة للمراجعة.", "أحاول إعادة إنتاج الخلل وجمع البيانات ذات الصلة، ثم أختبر فرضية واحدة في كل مرة. في مثال حقيقي من تجربتي: [وصف المشكلة]، [ما فعلته]، وكانت النتيجة [ما تحقق فعليًا].", "أوضح الأولوية والموعد ومخاطر التسليم، ثم أجزّئ العمل إلى خطوات قابلة للفحص. لا أتنازل عن [معيار جودة حقيقي]، وأتواصل مبكرًا إذا احتجت إلى تعديل النطاق.", "أوثق [القرار أو الخطوات] في [أداة أو طريقة استخدمتها] وأشارك السياق والنتيجة. يساعد ذلك الفريق على مراجعة العمل وإعادة استخدام المعرفة.", "أحدد معيارًا مرتبطًا بالمشكلة مثل [السرعة أو الدقة أو الاستقرار]. أقارن النتيجة قبل الحل وبعده، وأتأكد من عدم التأثير سلبًا في [جانب مهم].", "تعلمت [موضوعًا تقنيًا] عبر [مصدر أو تدريب حقيقي] وطبقته في [مشروع أو تمرين]. ما زلت أتعلم [جانب محدد] وأتحقق من فهمي بالتطبيق.", "أوضح ما أعرفه وما يحتاج إلى استيضاح، ثم أسأل عن القيود والنتيجة المطلوبة. بعد الاتفاق على افتراضات محددة، أقترح خطوة أولى صغيرة لاختبار الحل."],
    },
    hr: {
      questions: [
        "ما الذي جذبك إلى هذه الوظيفة؟",
        "ما بيئة العمل التي تساعدك على تقديم أفضل ما لديك؟",
        "كيف تتعامل مع ملاحظة بناءة حول عملك؟",
        "ما توقعاتك المهنية خلال السنوات القادمة؟",
        "ما أسلوب التواصل الذي تفضله داخل الفريق؟",
        "ما الذي يجعلك مناسبًا لهذا الدور؟",
      ],
      reasons: ["لفهم دوافعك وما إذا كنت قرأت عن الدور.", "لمعرفة الظروف التي تساعدك على النجاح.", "لقياس تقبلك للتعلم والتعاون.", "لفهم أهدافك ومدى توافقها مع الفرصة.", "لاستكشاف أسلوب تعاونك مع الآخرين.", "لمعرفة كيف تربط خبرتك بمتطلبات الوظيفة."],
      tips: ["كن محددًا في سبب اهتمامك بالدور أو الشركة.", "صف احتياجاتك المهنية بواقعية، واظهر مرونتك.", "قدّم مثالًا عن ملاحظة استقبلتها وما الذي غيّرته.", "تحدث عن اتجاهات ومهارات تريد تطويرها لا وعود مبالغ فيها.", "اشرح كيف تكيّف تواصلك مع الفريق والموقف.", "استخدم دليلًا من سيرتك بدل صفات عامة."],
      answers: ["جذبني في الوظيفة [مسؤولية محددة]، وأرى صلة بينها وبين خبرتي في {skills}. كما لفت انتباهي [معلومة بحثت عنها عن الشركة].", "أعمل بصورة أفضل عندما تكون الأولويات والتوقعات واضحة، مع مساحة للمبادرة والتواصل. وقد ساعدني ذلك في [مثال حقيقي إن توفر].", "أستمع للملاحظة وأتأكد من فهم التوقعات، ثم أختار إجراءً قابلًا للتطبيق وأتابع أثره. مثال من تجربتي: [موقف حقيقي وما تعلمته].", "أرغب في تعميق خبرتي في {role} وتطوير [مهارة أو مجال]، مع تحمل مسؤوليات تتناسب مع أدائي واحتياجات الفريق.", "أفضّل تواصلًا واضحًا ومبكرًا، وأكيّف التفاصيل والقناة حسب الجمهور. عندما تختلف الآراء، أركز على الهدف والحقائق.", "تتصل خبرتي في {skills} بمتطلبات {role}. ويمكنني توضيح ذلك بمثال حقيقي هو [موقف أو مشروع قدمته]."],
    },
    behavioral: {
      questions: [
        "حدثني عن موقف واجهت فيه تحديًا في العمل.",
        "صف موقفًا اختلفت فيه مع زميل حول طريقة تنفيذ مهمة.",
        "اذكر مثالًا على إنجاز عمل ضمن موعد ضيق.",
        "حدثني عن خطأ مهني وما تعلمته منه.",
        "صف موقفًا اضطررت فيه إلى تغيير أولوياتك بسرعة.",
        "اذكر موقفًا أقنعت فيه فريقك بفكرة.",
      ],
      reasons: ["لفهم طريقة تعاملك مع التحديات وما تتعلمه منها.", "لتقييم التعاون وحل الخلافات باحترام.", "لمعرفة كيفية ترتيب الأولويات تحت الضغط.", "لقياس تحمل المسؤولية والتعلم من التجربة.", "لاستكشاف المرونة والتواصل عند تغير الظروف.", "لفهم قدرتك على توضيح الأفكار والتأثير."],
      tips: ["استخدم STAR: الموقف، المهمة، الإجراء الذي قمت به، والنتيجة الفعلية.", "افصل ما كان مسؤوليتك عن رأي الفريق، واذكر النتيجة.", "وضح كيف رتبت الأولويات وما الذي أنجزته فعليًا.", "ركز على مسؤوليتك والإجراء التصحيحي والدرس المستفاد.", "اشرح سبب التغيير وكيف أبلغت المعنيين بالآثار.", "اشرح الفكرة والأدلة التي استخدمتها، واحترم وجهات النظر الأخرى."],
      answers: ["الموقف: [سياق حقيقي]. المهمة: كان المطلوب مني [مسؤوليتك]. الإجراء: قمت بـ[خطواتك أنت]. النتيجة: [نتيجة حقيقية أو ما تعلمته].", "الموقف: [سياق الخلاف]. المهمة: كان علينا [هدف مشترك]. الإجراء: ناقشت الخيارات واستمعـت إلى وجهة نظر زميلي ثم [خطوة فعلية]. النتيجة: [ما حدث].", "الموقف: [الموعد أو المشروع]. المهمة: كان عليّ تسليم [ما كنت مسؤولًا عنه]. الإجراء: رتبت الخطوات حسب الأهمية ونسقت مع [الأطراف]. النتيجة: [ما تحقق فعلًا].", "الموقف: [خطأ حقيقي]. المهمة: كانت مسؤوليتي [ما عليك]. الإجراء: اعترفت بالمشكلة وصححت [الخطوة]، ثم أضفت [إجراء وقائي]. النتيجة: تعلمت [درسًا محددًا].", "الموقف: تغير [شرط أو أولوية]. المهمة: كان عليّ الحفاظ على [هدف]. الإجراء: راجعت الأولويات وأبلغت المعنيين بـ[التعديل]. النتيجة: [الأثر الحقيقي].", "الموقف: [فكرة أو حاجة للفريق]. المهمة: كان عليّ اقتراح [ما تريد تغييره]. الإجراء: عرضت [دليل أو تجربة] واستقبلت الملاحظات. النتيجة: [القرار أو ما تعلمته]."],
    },
    management: {
      questions: [
        "كيف تحدد أولويات فريقك عندما تتنافس المهام؟",
        "كيف تدعم أداء عضو فريق يحتاج إلى مساعدة؟",
        "كيف تقيس نجاح الفريق في هذا الدور؟",
        "كيف تتعامل مع اختلافات الفريق حول قرار مهم؟",
        "كيف توزع المسؤوليات مع الحفاظ على وضوح الملكية؟",
        "كيف توازن بين أهداف الفريق واحتياجات أصحاب المصلحة؟",
      ],
      reasons: ["لفهم طريقة اتخاذ القرار وإدارة الموارد.", "لقياس أسلوبك في التوجيه والتواصل.", "لمعرفة مدى ربطك الأداء بنتائج قابلة للملاحظة.", "لاستكشاف قدرتك على تسهيل القرار والتعامل مع المخاطر.", "لفهم التفويض والمساءلة داخل الفريق.", "لتقييم إدارة التوقعات وترتيب المصالح."],
      tips: ["اذكر معايير الأولوية والأثر والمواعيد، ومتى تعيد التفاوض.", "صف حوارًا داعمًا وخطة واضحة للمتابعة دون افتراض تجربة لم تقدمها.", "اختر مؤشرات مرتبطة بأهداف الدور والجودة وتطور الفريق.", "وضح كيف تستمع وتعرض الخيارات وتوثق القرار.", "اشرح كيف توضح النتيجة المتوقعة والصلاحيات ونقاط المتابعة.", "اذكر طريقة تواصل مبكر وتوضيح المفاضلات والاتفاق على نتيجة."],
      answers: ["أرتب الأولويات بحسب أثرها في الهدف والموعد والاعتماديات والموارد. أوضح المفاضلات للفريق وأعيد التفاوض على النطاق عند الحاجة. مثال حقيقي: [كيف طبقت ذلك وما النتيجة].", "أبدأ بحوار لفهم العائق وتوقعات الدور، ثم نتفق على دعم وخطوات قصيرة قابلة للقياس. أتابع التقدم باحترام وأوثق ما يحتاج إلى تصعيد.", "أربط القياس بأهداف الفريق، مثل [مؤشر جودة أو تسليم أو رضا مستخدم]. أراجعه مع مؤشرات الاستدامة والتعاون حتى لا يشجع على نتيجة أحادية.", "أجمع وجهات النظر والحقائق، وأوضح المخاطر والخيارات ومعايير القرار. نتفق على المسؤول والموعد، ثم نراجع الأثر ونعدل إذا ظهرت معلومات جديدة.", "أحدد مخرجات كل مسؤولية وصلاحية صاحبها ونقطة المتابعة. أترك مساحة للاستقلالية مع توفير الدعم، وأتأكد من عدم تداخل الملكيات.", "أبدأ بفهم أهداف أصحاب المصلحة وأثر كل طلب. أشرح المفاضلات والقيود، ثم نتفق على ترتيب زمني وتحديثات واضحة."],
    },
  },
  en: {
    general: {
      questions: ["Tell me about yourself and your career path.", "Why are you applying for the {role} role?", "What do you know about {company}?", "What strength would help you in this role?", "What skill are you currently developing?", "What are you looking for in your next career step?"],
      reasons: ["To understand your background and how you connect it to the role.", "To assess your motivation and understanding of the position.", "To see how you prepared and what interests you about the organization.", "To understand the practical value you may bring.", "To explore your self-awareness and approach to learning.", "To understand your goals and whether they fit the opportunity."],
      tips: ["Aim for a 60–90 second summary and connect it to the role.", "Refer to a specific responsibility in the posting.", "Mention a concrete finding from your research, not generic praise.", "Choose one strength and support it with a real example.", "Name a specific skill and a real action you are taking to develop it.", "Focus on responsibilities and learning relevant to this position."],
      answers: ["My background is in {role}{years}. I focus on [real tasks or areas], and one contribution I can discuss is [a real example]. I am now looking to apply {skills} in this role.", "I am interested in the responsibilities of a {role}, particularly [a specific responsibility from the posting]. My experience with {skills} relates to that work, and I would like to contribute it at {company}.", "In my research, I noticed [a verified fact about the organization or its work]. I see a connection between the role's focus on {keywords} and my experience with {skills}.", "One of my strengths is {skills}. I applied it in [a real situation], which led to [an actual result or lesson].", "I am currently developing [a specific skill] through [a real course, practice, or project]. I check my progress by [a clear method].", "I am looking for an opportunity to contribute as a {role} and grow in [a real area]. This position caught my attention because it focuses on {keywords}."],
    },
    technical: {
      questions: ["How would you approach a common technical challenge in {domain}?", "How do you choose a tool or approach to solve a {role} problem?", "Walk me through how you investigate a defect or unexpected result.", "How do you balance delivery speed and quality?", "How do you document your work and share context?", "How do you measure whether a technical solution worked?", "Tell me about a technical topic you learned and applied.", "What do you do when technical requirements are unclear?"],
      reasons: ["To assess your problem-solving process rather than recall alone.", "To understand how you evaluate options and practical constraints.", "To learn how you diagnose and verify issues.", "To assess how you balance delivery and reliability.", "To understand collaboration and maintainability practices.", "To see how you connect technical work to outcomes.", "To explore how you learn and apply new knowledge.", "To assess how you turn ambiguity into actionable steps."],
      tips: ["State the problem, steps, and tools you have actually used; do not overclaim.", "Explain selection criteria, alternatives, and trade-offs.", "Structure your answer: reproduce, hypothesize, test, verify.", "Mention priorities, risks, and a quality standard you protect.", "Give a real example of documentation, review, or knowledge sharing.", "Connect a technical measure to a user or team need.", "Use a genuine example, including a learning project if relevant.", "Ask about constraints, state assumptions, and explain how you would validate them."],
      answers: ["In {domain}, I would first clarify the problem, context, and requirements. I would verify it using [steps or tools I have actually used], then compare approaches against [real criteria]. As a {role}, I would document the decision and check [a relevant measure].", "I start with the task requirements and constraints, then compare options I have used or understand, such as {keywords}. I choose based on [performance, accuracy, or maintainability] and validate the choice with a test or reviewable result.", "I try to reproduce the issue and gather relevant evidence, then test one hypothesis at a time. A real example from my experience is [problem], [what I did], and [what actually happened].", "I clarify priority, deadline, and delivery risks, then break the work into verifiable steps. I protect [a real quality standard] and communicate early if scope needs to change.", "I document [the decision or steps] in [a tool or format I have used] and share the context and outcome so the team can review and reuse the learning.", "I choose a measure connected to the problem, such as [speed, accuracy, or stability]. I compare before and after and check that [another important area] was not negatively affected.", "I learned [a technical topic] through [a real source or practice] and applied it in [a project or exercise]. I am still developing [a specific area] and verify my understanding through practice.", "I separate what is known from what needs clarification, ask about constraints and the desired outcome, then agree on assumptions and suggest a small first step to test."],
    },
    hr: {
      questions: ["What attracted you to this position?", "What kind of work environment helps you do your best work?", "How do you respond to constructive feedback?", "What are your professional goals for the next few years?", "How do you prefer to communicate with a team?", "What makes you a good fit for this role?"],
      reasons: ["To understand your motivation and whether you explored the role.", "To learn what conditions support your success.", "To assess openness to learning and collaboration.", "To understand your goals and their fit with the opportunity.", "To explore how you work with others.", "To hear how you connect your background to the role."],
      tips: ["Be specific about what interests you in the role or organization.", "Describe your needs realistically and show adaptability.", "Share a real piece of feedback and what you changed.", "Discuss skills or directions you want to develop, not guarantees.", "Explain how you adapt communication to people and context.", "Use evidence from your experience rather than general adjectives."],
      answers: ["I was drawn to [a specific responsibility], which connects with my experience in {skills}. I also noticed [a researched fact about the organization].", "I do my best work when priorities and expectations are clear, with room to take initiative and communicate. This has helped me [a real example, if available].", "I listen, clarify expectations, and choose a practical action to apply the feedback. A real example is [what happened and what I learned].", "I would like to deepen my experience in {role} and develop [a skill or area], taking on responsibilities that fit my contribution and the team's needs.", "I value clear, timely communication and adapt the level of detail and channel to the audience. When views differ, I focus on the shared goal and evidence.", "My experience with {skills} relates to the needs of a {role}. I can illustrate that with [a real situation or project]."],
    },
    behavioral: {
      questions: ["Tell me about a challenge you faced at work.", "Describe a time you disagreed with a colleague about how to do a task.", "Give an example of delivering work against a tight deadline.", "Tell me about a work mistake and what you learned.", "Describe a time your priorities changed quickly.", "Tell me about a time you persuaded your team to consider an idea."],
      reasons: ["To understand how you handle challenges and learn from them.", "To assess collaboration and respectful conflict resolution.", "To learn how you prioritize under pressure.", "To assess accountability and learning.", "To explore adaptability and communication during change.", "To understand how you explain ideas and influence others."],
      tips: ["Use STAR: Situation, Task, Action, Result. Keep the focus on your own actions.", "Separate your responsibility from the team's views and explain the outcome.", "Explain how you prioritized and what you actually delivered.", "Focus on accountability, corrective action, and the lesson learned.", "Explain why things changed and how you communicated the impact.", "Describe your idea and evidence while acknowledging other perspectives."],
      answers: ["Situation: [a real context]. Task: I was responsible for [your responsibility]. Action: I [steps you personally took]. Result: [an actual outcome or lesson].", "Situation: [the disagreement]. Task: We needed to [shared goal]. Action: I discussed options, listened, and [a real step you took]. Result: [what happened].", "Situation: [the project and deadline]. Task: I needed to deliver [your responsibility]. Action: I prioritized and coordinated with [people involved]. Result: [what was actually achieved].", "Situation: [a real mistake]. Task: I was responsible for [your role]. Action: I acknowledged it, corrected [the issue], and introduced [a preventive step]. Result: I learned [a specific lesson].", "Situation: [what changed]. Task: I needed to protect [the goal]. Action: I reviewed priorities and communicated [the adjustment]. Result: [the actual impact].", "Situation: [a team need]. Task: I proposed [your idea]. Action: I presented [evidence or a trial] and invited feedback. Result: [the decision or what you learned]."],
    },
    management: {
      questions: ["How do you prioritize when your team's work competes for attention?", "How do you support a team member who is struggling?", "How would you measure success for a team in this role?", "How do you handle disagreement about an important team decision?", "How do you assign ownership while keeping responsibilities clear?", "How do you balance team goals and stakeholder needs?"],
      reasons: ["To understand decision-making and resource management.", "To assess your coaching and communication approach.", "To learn whether you connect performance with observable outcomes.", "To explore facilitation, judgment, and risk management.", "To understand delegation and accountability.", "To assess expectation-setting and prioritization."],
      tips: ["Explain impact, deadlines, dependencies, and when you renegotiate.", "Describe a supportive conversation and a clear follow-up plan.", "Choose measures connected to role goals, quality, and team development.", "Explain how you listen, compare options, and document a decision.", "Clarify the expected outcome, authority, and check-in points.", "Mention early communication, trade-offs, and agreed outcomes."],
      answers: ["I prioritize by impact, deadline, dependencies, and available capacity. I make trade-offs visible and renegotiate scope when needed. A real example is [what I did and the outcome].", "I start with a supportive conversation to understand the obstacle and role expectations. We agree on practical steps and check-ins, and I offer support while being clear about accountability.", "I connect measures to team goals, such as [a quality, delivery, or user measure]. I consider sustainability and collaboration too, so one metric does not distort the outcome.", "I gather perspectives and evidence, clarify risks and options, and agree on decision criteria. We record the owner and next review point, then adapt if new evidence appears.", "I clarify each outcome, decision authority, and check-in point. I allow autonomy while making support available and checking that ownership does not overlap.", "I clarify stakeholder outcomes and the impact of each request, communicate constraints and trade-offs early, then align on timing and updates."],
    },
  },
  fr: {
    general: {
      questions: ["Pouvez-vous présenter votre parcours professionnel ?", "Pourquoi postulez-vous au poste de {role} ?", "Que savez-vous de {company} ?", "Quelle qualité vous aiderait dans ce poste ?", "Quelle compétence souhaitez-vous développer ?", "Que recherchez-vous pour la suite de votre parcours ?"],
      reasons: ["Comprendre votre parcours et son lien avec le poste.", "Évaluer votre motivation et votre compréhension du rôle.", "Vérifier votre préparation et votre intérêt pour l’entreprise.", "Comprendre la valeur que vous pourriez apporter.", "Explorer votre capacité à apprendre.", "Comprendre vos objectifs professionnels."],
      tips: ["Faites une présentation concise et reliez-la au poste.", "Citez une responsabilité précise de l’annonce.", "Mentionnez un fait concret sur l’entreprise.", "Choisissez une qualité et illustrez-la par un exemple réel.", "Citez une compétence et une action réelle pour la développer.", "Parlez d’objectifs liés à cette opportunité."],
      answers: ["Mon parcours est orienté vers {role}{years}. Je travaille sur [missions réelles] et je peux présenter [un exemple concret]. Je souhaite mettre {skills} au service de ce poste.", "Les missions de {role}, notamment [une mission de l’annonce], m’intéressent. Mon expérience en {skills} est liée à ce travail et je souhaite la mettre à profit chez {company}.", "Dans mes recherches, j’ai relevé [un fait vérifié sur l’entreprise]. Je vois un lien entre les priorités {keywords} du poste et mon expérience en {skills}.", "L’une de mes qualités est {skills}. Je l’ai mobilisée dans [une situation réelle], avec [un résultat ou apprentissage réel].", "Je développe actuellement [une compétence] grâce à [une formation ou pratique réelle]. Je mesure mes progrès par [une méthode concrète].", "Je recherche un poste où contribuer comme {role} et progresser en [un domaine]. Cette offre m’intéresse par son orientation vers {keywords}."],
    },
    technical: {
      questions: ["Comment aborderiez-vous un défi technique courant dans {domain} ?", "Comment choisissez-vous une approche pour résoudre un problème de {role} ?", "Comment analysez-vous un défaut ou un résultat inattendu ?", "Comment conciliez-vous rapidité et qualité ?", "Comment documentez-vous votre travail ?", "Comment mesurez-vous l’efficacité d’une solution ?", "Parlez d’un sujet technique appris et appliqué.", "Que faites-vous si les exigences techniques sont floues ?"],
      reasons: ["Évaluer votre méthode de résolution.", "Comprendre vos critères de choix.", "Découvrir votre démarche de diagnostic.", "Évaluer l’équilibre entre livraison et fiabilité.", "Comprendre votre collaboration.", "Relier le travail technique aux résultats.", "Explorer votre capacité à apprendre.", "Évaluer votre méthode face à l’ambiguïté."],
      tips: ["N’évoquez que les outils et méthodes que vous connaissez réellement.", "Expliquez les critères, options et compromis.", "Structurez : reproduire, formuler une hypothèse, tester, vérifier.", "Précisez les priorités et standards de qualité.", "Donnez un exemple réel de documentation ou partage.", "Reliez la mesure aux besoins de l’équipe ou des utilisateurs.", "Un projet d’apprentissage réel peut servir d’exemple.", "Clarifiez les contraintes et vos hypothèses."],
      answers: ["Dans {domain}, je clarifierais le problème et les exigences, puis vérifierais [des étapes ou outils réellement utilisés]. Je comparerais les options selon [des critères] et suivrais [une mesure pertinente] pour le poste de {role}.", "Je commence par les exigences et contraintes, puis compare les options que je connais, comme {keywords}. Je choisis selon [la performance, la précision ou la maintenance] et vérifie le résultat.", "J’essaie de reproduire le problème et de recueillir des éléments, puis teste une hypothèse à la fois. Un exemple réel : [problème], [action], [résultat réel].", "Je clarifie la priorité, le délai et les risques, puis découpe le travail en étapes vérifiables. Je protège [un standard réel] et communique tôt si le périmètre évolue.", "Je documente [les étapes ou la décision] avec [un outil réellement utilisé] et partage le contexte pour permettre la revue et la réutilisation.", "Je choisis une mesure liée au problème, comme [rapidité, précision ou stabilité], puis compare avant et après et vérifie [un autre aspect important].", "J’ai appris [un sujet] grâce à [une source ou pratique réelle] et l’ai appliqué dans [un projet ou exercice]. Je développe encore [un aspect précis].", "Je distingue les éléments connus des questions ouvertes, clarifie les contraintes et propose une première étape limitée pour valider la solution."],
    },
    hr: {
      questions: ["Qu’est-ce qui vous attire dans ce poste ?", "Quel environnement vous aide à donner le meilleur de vous-même ?", "Comment réagissez-vous à un retour constructif ?", "Quels sont vos objectifs professionnels ?", "Comment préférez-vous communiquer en équipe ?", "Pourquoi votre profil correspond-il à ce poste ?"],
      reasons: ["Comprendre votre motivation.", "Découvrir vos conditions de réussite.", "Évaluer votre ouverture à l’apprentissage.", "Comprendre vos objectifs.", "Explorer votre collaboration.", "Relier votre parcours au poste."],
      tips: ["Soyez précis sur le poste ou l’entreprise.", "Décrivez vos besoins avec réalisme et souplesse.", "Citez un retour réel et ce que vous avez changé.", "Parlez de compétences à développer sans promesses excessives.", "Expliquez comment vous adaptez votre communication.", "Appuyez-vous sur des faits plutôt que des adjectifs."],
      answers: ["Je suis attiré par [une responsabilité précise], liée à mon expérience en {skills}. J’ai également relevé [un fait vérifié sur l’entreprise].", "Je travaille mieux avec des priorités claires, tout en gardant une marge d’initiative et d’échange. Cela m’a aidé à [un exemple réel].", "J’écoute, clarifie les attentes et applique une action concrète. Un exemple réel : [situation et apprentissage].", "Je souhaite approfondir mon expérience en {role} et développer [une compétence] selon les besoins de l’équipe.", "Je privilégie une communication claire et rapide, adaptée aux personnes et au contexte. En cas de désaccord, je reviens à l’objectif commun.", "Mon expérience en {skills} correspond aux besoins du poste de {role}. Je peux l’illustrer par [une situation ou un projet réel]."],
    },
    behavioral: {
      questions: ["Parlez d’un défi rencontré au travail.", "Décrivez un désaccord avec un collègue.", "Donnez un exemple de délai serré.", "Parlez d’une erreur professionnelle et de votre apprentissage.", "Décrivez un changement soudain de priorités.", "Parlez d’une idée que vous avez défendue auprès d’une équipe."],
      reasons: ["Comprendre votre réaction face aux difficultés.", "Évaluer la collaboration et la gestion des désaccords.", "Comprendre votre organisation sous pression.", "Évaluer la responsabilité et l’apprentissage.", "Explorer votre adaptabilité.", "Comprendre votre capacité à expliquer vos idées."],
      tips: ["Utilisez STAR : Situation, Tâche, Action, Résultat réel.", "Distinguez votre rôle de celui de l’équipe.", "Expliquez vos priorités et le résultat obtenu.", "Montrez votre responsabilité et la mesure corrective.", "Expliquez le changement et votre communication.", "Présentez des éléments concrets et écoutez les objections."],
      answers: ["Situation : [contexte réel]. Tâche : [votre responsabilité]. Action : [vos actions]. Résultat : [résultat réel ou apprentissage].", "Situation : [désaccord]. Tâche : [objectif commun]. Action : j’ai écouté et [action réelle]. Résultat : [ce qui s’est passé].", "Situation : [projet et délai]. Tâche : [votre livrable]. Action : j’ai priorisé et coordonné [les personnes]. Résultat : [résultat réel].", "Situation : [erreur réelle]. Tâche : [votre rôle]. Action : j’ai reconnu le problème et corrigé [l’élément]. Résultat : j’ai appris [une leçon précise].", "Situation : [changement]. Tâche : préserver [l’objectif]. Action : j’ai révisé les priorités et informé [les personnes]. Résultat : [impact réel].", "Situation : [besoin]. Tâche : proposer [votre idée]. Action : j’ai présenté [des éléments] et écouté les retours. Résultat : [décision ou apprentissage]."],
    },
    management: {
      questions: ["Comment priorisez-vous les tâches de votre équipe ?", "Comment accompagnez-vous un collaborateur en difficulté ?", "Comment mesurez-vous le succès d’une équipe ?", "Comment gérez-vous un désaccord sur une décision importante ?", "Comment clarifiez-vous les responsabilités ?", "Comment conciliez-vous objectifs d’équipe et besoins des parties prenantes ?"],
      reasons: ["Comprendre vos décisions et votre gestion des ressources.", "Évaluer votre accompagnement.", "Relier performance et résultats observables.", "Explorer votre facilitation des décisions.", "Comprendre délégation et responsabilité.", "Évaluer la gestion des attentes."],
      tips: ["Citez impact, délais, dépendances et arbitrages.", "Décrivez un échange de soutien et un suivi clair.", "Choisissez des indicateurs de résultats et de qualité.", "Expliquez écoute, options, critères et décision.", "Clarifiez résultat, autorité et points de suivi.", "Parlez de communication précoce et d’arbitrages."],
      answers: ["Je priorise selon l’impact, les délais, les dépendances et les ressources. Je rends les arbitrages visibles. Exemple réel : [action et résultat].", "Je commence par comprendre l’obstacle et les attentes, puis conviens d’étapes pratiques et d’un suivi, en offrant soutien et clarté.", "Je relie les indicateurs aux objectifs, par exemple [qualité, livraison ou utilisateurs], tout en considérant la durabilité et la collaboration.", "Je recueille les points de vue et les faits, clarifie les risques et critères, puis consigne la décision, le responsable et le prochain suivi.", "Je clarifie les résultats attendus, l’autonomie et le suivi de chaque responsabilité, tout en restant disponible pour aider.", "Je clarifie les objectifs et contraintes, explique les arbitrages et aligne les parties sur un calendrier et des mises à jour."],
    },
  },
  es: {
    general: {
      questions: ["Cuénteme sobre su trayectoria profesional.", "¿Por qué solicita el puesto de {role}?", "¿Qué sabe de {company}?", "¿Qué fortaleza le ayudaría en este puesto?", "¿Qué habilidad está desarrollando actualmente?", "¿Qué busca en su próximo paso profesional?"],
      reasons: ["Conocer su trayectoria y cómo la relaciona con el puesto.", "Evaluar su motivación y comprensión del cargo.", "Comprobar su preparación e interés por la organización.", "Entender el valor práctico que puede aportar.", "Explorar su disposición para aprender.", "Comprender sus objetivos profesionales."],
      tips: ["Resuma su perfil en 60–90 segundos y relaciónelo con el puesto.", "Mencione una responsabilidad concreta del anuncio.", "Comparta un dato específico investigado sobre la empresa.", "Elija una fortaleza y apóyela con un ejemplo real.", "Nombre una habilidad y una acción real para desarrollarla.", "Enfoque sus objetivos en este puesto."],
      answers: ["Mi trayectoria se centra en {role}{years}. Trabajo en [tareas reales] y puedo compartir [un ejemplo concreto]. Ahora quiero aportar {skills} en este puesto.", "Me interesan las responsabilidades de {role}, especialmente [una responsabilidad del anuncio]. Mi experiencia en {skills} se relaciona con esa labor y me gustaría aportarla en {company}.", "En mi investigación observé [un dato verificado sobre la empresa]. Veo una conexión entre {keywords} y mi experiencia en {skills}.", "Una de mis fortalezas es {skills}. La apliqué en [una situación real] y obtuve [un resultado o aprendizaje real].", "Actualmente desarrollo [una habilidad] mediante [un curso o práctica real]. Evalúo mi progreso con [un método concreto].", "Busco una oportunidad para contribuir como {role} y crecer en [un área real]. Me interesa este puesto por su enfoque en {keywords}."],
    },
    technical: {
      questions: ["¿Cómo abordaría un reto técnico habitual en {domain}?", "¿Cómo elige un enfoque para resolver un problema de {role}?", "¿Cómo investiga un fallo o resultado inesperado?", "¿Cómo equilibra rapidez y calidad?", "¿Cómo documenta y comparte su trabajo?", "¿Cómo mide si una solución funcionó?", "Cuéntenos sobre un tema técnico que aprendió y aplicó.", "¿Qué hace cuando los requisitos técnicos no están claros?"],
      reasons: ["Evaluar su método para resolver problemas.", "Entender sus criterios de selección.", "Conocer su proceso de diagnóstico.", "Evaluar el equilibrio entre entrega y fiabilidad.", "Entender su colaboración.", "Relacionar el trabajo técnico con resultados.", "Explorar su capacidad de aprendizaje.", "Evaluar cómo gestiona la ambigüedad."],
      tips: ["Mencione solo herramientas y métodos que realmente conoce.", "Explique criterios, alternativas y compensaciones.", "Ordene: reproducir, plantear hipótesis, probar y verificar.", "Indique prioridades, riesgos y estándares de calidad.", "Comparta un ejemplo real de documentación o revisión.", "Relacione la métrica con necesidades del equipo o usuario.", "Puede usar un proyecto real de aprendizaje.", "Aclare restricciones y supuestos antes de proponer."],
      answers: ["En {domain}, primero aclararía el problema y los requisitos. Verificaría con [pasos o herramientas que sí he usado] y compararía opciones según [criterios reales]. Mediría [un indicador] para el puesto de {role}.", "Empiezo por los requisitos y restricciones, comparo opciones que conozco como {keywords} y elijo según [rendimiento, precisión o mantenimiento]. Después valido con una prueba.", "Intento reproducir el problema y reunir evidencias, luego pruebo una hipótesis cada vez. Un ejemplo real es [problema], [acción] y [resultado real].", "Aclaro prioridad, plazo y riesgos, y divido el trabajo en pasos verificables. Protejo [un estándar real] y comunico pronto si cambia el alcance.", "Documento [la decisión o pasos] con [una herramienta real] y comparto el contexto para que el equipo pueda revisar y reutilizar lo aprendido.", "Elijo una medida relacionada con el problema, como [velocidad, precisión o estabilidad], comparo antes y después y verifico [otro aspecto].", "Aprendí [tema técnico] mediante [fuente o práctica real] y lo apliqué en [proyecto o ejercicio]. Sigo desarrollando [un aspecto concreto].", "Separo lo conocido de lo que falta aclarar, pregunto por las restricciones y propongo un primer paso pequeño para validar."],
    },
    hr: {
      questions: ["¿Qué le atrajo de este puesto?", "¿Qué entorno laboral le ayuda a dar lo mejor?", "¿Cómo responde a comentarios constructivos?", "¿Cuáles son sus objetivos profesionales?", "¿Cómo prefiere comunicarse con un equipo?", "¿Por qué encaja con este puesto?"],
      reasons: ["Comprender su motivación.", "Conocer las condiciones que favorecen su trabajo.", "Evaluar su apertura al aprendizaje.", "Entender sus objetivos.", "Explorar su colaboración.", "Relacionar su perfil con el puesto."],
      tips: ["Sea concreto sobre el puesto o la empresa.", "Describa sus necesidades de forma realista y flexible.", "Comparta un comentario real y qué cambió.", "Hable de habilidades a desarrollar sin promesas exageradas.", "Explique cómo adapta su comunicación.", "Apóyese en hechos, no solo adjetivos."],
      answers: ["Me interesó [una responsabilidad concreta], relacionada con mi experiencia en {skills}. También observé [un dato investigado sobre la empresa].", "Trabajo mejor cuando las prioridades y expectativas están claras, con espacio para iniciativa y comunicación. Esto me ayudó a [un ejemplo real].", "Escucho, aclaro las expectativas y aplico una acción práctica. Un ejemplo real es [situación y aprendizaje].", "Quiero profundizar mi experiencia en {role} y desarrollar [una habilidad] de acuerdo con las necesidades del equipo.", "Prefiero una comunicación clara y oportuna, adaptada a las personas y al contexto. Ante diferencias, vuelvo al objetivo común.", "Mi experiencia en {skills} se relaciona con las necesidades de {role}. Puedo ilustrarlo con [una situación o proyecto real]."],
    },
    behavioral: {
      questions: ["Cuéntenos sobre un reto que afrontó en el trabajo.", "Describa un desacuerdo con un compañero.", "Dé un ejemplo de un plazo ajustado.", "Cuéntenos un error profesional y qué aprendió.", "Describa un cambio rápido de prioridades.", "Cuéntenos cuándo defendió una idea ante un equipo."],
      reasons: ["Comprender cómo afronta los retos.", "Evaluar colaboración y resolución respetuosa de conflictos.", "Conocer su organización bajo presión.", "Evaluar responsabilidad y aprendizaje.", "Explorar su adaptación al cambio.", "Entender cómo explica e influye."],
      tips: ["Use STAR: Situación, Tarea, Acción y Resultado real.", "Distinga su responsabilidad de la opinión del equipo.", "Explique prioridades y resultados concretos.", "Muestre responsabilidad, corrección y aprendizaje.", "Explique el cambio y cómo comunicó su impacto.", "Presente evidencias y escuche otros puntos de vista."],
      answers: ["Situación: [contexto real]. Tarea: debía [su responsabilidad]. Acción: [pasos que tomó]. Resultado: [resultado real o aprendizaje].", "Situación: [desacuerdo]. Tarea: necesitábamos [objetivo común]. Acción: escuché y [paso real]. Resultado: [lo ocurrido].", "Situación: [proyecto y plazo]. Tarea: debía entregar [su parte]. Acción: prioricé y coordiné con [personas]. Resultado: [logro real].", "Situación: [error real]. Tarea: era responsable de [su función]. Acción: reconocí y corregí [el problema]. Resultado: aprendí [una lección concreta].", "Situación: cambió [la prioridad]. Tarea: debía proteger [el objetivo]. Acción: revisé prioridades e informé [el ajuste]. Resultado: [impacto real].", "Situación: [necesidad del equipo]. Tarea: propuse [idea]. Acción: presenté [evidencias] y escuché comentarios. Resultado: [decisión o aprendizaje]."],
    },
    management: {
      questions: ["¿Cómo prioriza cuando compiten las tareas del equipo?", "¿Cómo apoya a un miembro del equipo que tiene dificultades?", "¿Cómo mediría el éxito del equipo?", "¿Cómo gestiona desacuerdos sobre una decisión importante?", "¿Cómo asigna responsabilidades con claridad?", "¿Cómo equilibra metas y necesidades de las partes interesadas?"],
      reasons: ["Entender sus decisiones y gestión de recursos.", "Evaluar su acompañamiento.", "Relacionar desempeño con resultados observables.", "Explorar cómo facilita decisiones.", "Comprender delegación y responsabilidad.", "Evaluar gestión de expectativas."],
      tips: ["Considere impacto, plazos, dependencias y recursos.", "Describa una conversación de apoyo y un seguimiento claro.", "Elija indicadores ligados a objetivos y calidad.", "Explique cómo escucha, compara opciones y documenta.", "Aclare resultados, autoridad y revisiones.", "Mencione comunicación temprana y compensaciones."],
      answers: ["Priorizo según impacto, plazo, dependencias y capacidad. Hago visibles las compensaciones y renegocio el alcance si hace falta. Ejemplo real: [acción y resultado].", "Empiezo por entender el obstáculo y las expectativas, luego acordamos pasos prácticos y revisiones, con apoyo y responsabilidad claros.", "Relaciono los indicadores con objetivos, como [calidad, entrega o usuarios], considerando también sostenibilidad y colaboración.", "Reúno perspectivas y evidencias, aclaro riesgos y criterios, y acordamos responsable y fecha de revisión.", "Aclaro resultados esperados, autoridad y seguimiento de cada responsabilidad, dejando autonomía y apoyo.", "Aclaro objetivos y restricciones, explico compensaciones y acordamos calendario y actualizaciones."],
    },
  },
  de: {
    general: {
      questions: ["Erzählen Sie von Ihrem beruflichen Werdegang.", "Warum bewerben Sie sich für die Stelle als {role}?", "Was wissen Sie über {company}?", "Welche Stärke hilft Ihnen in dieser Position?", "Welche Fähigkeit entwickeln Sie derzeit?", "Was suchen Sie in Ihrem nächsten Karriereschritt?"],
      reasons: ["Ihren Hintergrund und den Bezug zur Stelle verstehen.", "Motivation und Verständnis der Rolle einschätzen.", "Vorbereitung und Interesse am Unternehmen kennenlernen.", "Ihren möglichen Beitrag verstehen.", "Lernbereitschaft erkunden.", "Ihre beruflichen Ziele einordnen."],
      tips: ["Fassen Sie sich kurz und stellen Sie den Bezug zur Stelle her.", "Nennen Sie eine konkrete Verantwortung aus der Ausschreibung.", "Erwähnen Sie eine recherchierte Tatsache statt allgemeines Lob.", "Belegen Sie eine Stärke mit einem echten Beispiel.", "Nennen Sie eine Fähigkeit und eine reale Lernmaßnahme.", "Konzentrieren Sie sich auf Ziele, die zur Stelle passen."],
      answers: ["Mein beruflicher Hintergrund liegt im Bereich {role}{years}. Ich arbeite an [echten Aufgaben] und kann [ein konkretes Beispiel] nennen. Nun möchte ich {skills} in dieser Position einbringen.", "Mich interessieren die Aufgaben als {role}, besonders [eine konkrete Aufgabe aus der Anzeige]. Meine Erfahrung mit {skills} passt dazu, und ich möchte sie bei {company} einsetzen.", "Bei meiner Recherche ist mir [eine überprüfte Tatsache] aufgefallen. Ich sehe einen Bezug zwischen {keywords} und meiner Erfahrung mit {skills}.", "Eine meiner Stärken ist {skills}. Ich habe sie in [einer echten Situation] eingesetzt; dabei entstand [ein tatsächliches Ergebnis oder eine Erkenntnis].", "Ich entwickle derzeit [eine Fähigkeit] durch [einen realen Kurs oder Übung]. Meinen Fortschritt prüfe ich mit [einer konkreten Methode].", "Ich suche eine Möglichkeit, als {role} beizutragen und mich in [einem realistischen Bereich] weiterzuentwickeln. Die Schwerpunkte {keywords} sprechen mich an."],
    },
    technical: {
      questions: ["Wie würden Sie eine typische technische Herausforderung in {domain} angehen?", "Wie wählen Sie einen Ansatz für ein Problem als {role}?", "Wie untersuchen Sie einen Fehler oder unerwartetes Ergebnis?", "Wie verbinden Sie Tempo und Qualität?", "Wie dokumentieren und teilen Sie Ihre Arbeit?", "Wie messen Sie den Erfolg einer technischen Lösung?", "Berichten Sie von einem erlernten technischen Thema.", "Was tun Sie bei unklaren technischen Anforderungen?"],
      reasons: ["Ihre Problemlösungsmethode beurteilen.", "Ihre Auswahlkriterien verstehen.", "Ihre Diagnoseweise kennenlernen.", "Lieferung und Zuverlässigkeit abwägen.", "Zusammenarbeit und Wartbarkeit verstehen.", "Technik mit Ergebnissen verbinden.", "Lernfähigkeit erkunden.", "Umgang mit Unklarheit beurteilen."],
      tips: ["Nennen Sie nur Methoden und Werkzeuge, die Sie tatsächlich kennen.", "Erklären Sie Kriterien, Alternativen und Abwägungen.", "Strukturieren: reproduzieren, vermuten, testen, überprüfen.", "Nennen Sie Prioritäten, Risiken und Qualitätsstandards.", "Verwenden Sie ein echtes Beispiel für Dokumentation oder Review.", "Verbinden Sie Kennzahlen mit Nutzer- oder Teambedarf.", "Auch ein echtes Lernprojekt eignet sich als Beispiel.", "Klären Sie Einschränkungen und Annahmen."],
      answers: ["In {domain} würde ich zunächst Problem und Anforderungen klären. Ich prüfe mit [tatsächlich genutzten Schritten oder Werkzeugen] und vergleiche Ansätze nach [realen Kriterien]. Für {role} messe ich [einen passenden Wert].", "Ich beginne mit Anforderungen und Grenzen, vergleiche bekannte Optionen wie {keywords} und entscheide nach [Leistung, Genauigkeit oder Wartbarkeit]. Danach prüfe ich das Ergebnis.", "Ich versuche, den Fehler zu reproduzieren und Belege zu sammeln, dann teste ich einzelne Hypothesen. Ein echtes Beispiel: [Problem], [mein Vorgehen], [tatsächliches Ergebnis].", "Ich kläre Priorität, Termin und Risiken und teile die Arbeit in überprüfbare Schritte. Ich schütze [einen realen Qualitätsstandard] und kommuniziere früh bei Änderungen.", "Ich dokumentiere [Entscheidung oder Schritte] mit [einem tatsächlich genutzten Werkzeug] und teile den Kontext, damit das Team es prüfen und wiederverwenden kann.", "Ich wähle einen problembezogenen Wert wie [Tempo, Genauigkeit oder Stabilität], vergleiche vorher und nachher und prüfe [einen weiteren Aspekt].", "Ich lernte [Thema] durch [eine echte Quelle oder Übung] und setzte es in [Projekt oder Übung] ein. Derzeit vertiefe ich [einen konkreten Aspekt].", "Ich trenne Bekanntes von offenen Fragen, kläre Grenzen und gewünschtes Ergebnis und schlage einen kleinen ersten Prüfschritt vor."],
    },
    hr: {
      questions: ["Was interessiert Sie an dieser Stelle?", "Welches Arbeitsumfeld unterstützt Ihre beste Leistung?", "Wie gehen Sie mit konstruktivem Feedback um?", "Welche beruflichen Ziele haben Sie?", "Wie kommunizieren Sie am liebsten im Team?", "Warum passen Sie zu dieser Stelle?"],
      reasons: ["Ihre Motivation verstehen.", "Erfolgsbedingungen kennenlernen.", "Lernbereitschaft einschätzen.", "Berufliche Ziele verstehen.", "Zusammenarbeit erkunden.", "Ihren Hintergrund mit der Stelle verbinden."],
      tips: ["Seien Sie konkret zur Stelle oder Organisation.", "Beschreiben Sie Ihre Bedürfnisse realistisch und flexibel.", "Nennen Sie echtes Feedback und Ihre Veränderung.", "Sprechen Sie über Entwicklung statt übertriebene Versprechen.", "Erklären Sie, wie Sie Kommunikation anpassen.", "Belegen Sie Aussagen mit echten Beispielen."],
      answers: ["Mich interessiert [eine konkrete Aufgabe], die zu meiner Erfahrung mit {skills} passt. Außerdem habe ich [eine recherchierte Tatsache] über das Unternehmen erfahren.", "Ich arbeite gut mit klaren Prioritäten und Erwartungen sowie Raum für Initiative und Austausch. Das half mir bei [einem echten Beispiel].", "Ich höre zu, kläre Erwartungen und setze eine konkrete Maßnahme um. Ein echtes Beispiel: [Situation und Erkenntnis].", "Ich möchte meine Erfahrung in {role} vertiefen und [eine Fähigkeit] passend zum Teambedarf entwickeln.", "Ich bevorzuge klare, rechtzeitige Kommunikation und passe sie an Personen und Kontext an. Bei unterschiedlichen Ansichten konzentriere ich mich auf das gemeinsame Ziel.", "Meine Erfahrung mit {skills} passt zu den Anforderungen als {role}. Das kann ich mit [einer echten Situation oder einem Projekt] zeigen."],
    },
    behavioral: {
      questions: ["Berichten Sie von einer Herausforderung bei der Arbeit.", "Beschreiben Sie eine Meinungsverschiedenheit mit einem Kollegen.", "Nennen Sie ein Beispiel für eine knappe Frist.", "Was haben Sie aus einem beruflichen Fehler gelernt?", "Berichten Sie von einer schnellen Prioritätsänderung.", "Wie haben Sie Ihr Team von einer Idee überzeugt?"],
      reasons: ["Umgang mit Herausforderungen verstehen.", "Zusammenarbeit und Konfliktlösung einschätzen.", "Priorisierung unter Druck kennenlernen.", "Verantwortung und Lernen beurteilen.", "Anpassungsfähigkeit erkunden.", "Erklären und Einfluss verstehen."],
      tips: ["Nutzen Sie STAR: Situation, Aufgabe, Handlung, tatsächliches Ergebnis.", "Trennen Sie Ihren Beitrag von der Teammeinung.", "Erklären Sie Prioritäten und tatsächliche Lieferung.", "Zeigen Sie Verantwortung, Korrektur und Erkenntnis.", "Erläutern Sie Änderung und Kommunikation.", "Nennen Sie Belege und hören Sie andere Sichtweisen an."],
      answers: ["Situation: [echter Kontext]. Aufgabe: [Ihre Verantwortung]. Handlung: [Ihre Schritte]. Ergebnis: [tatsächliches Ergebnis oder Erkenntnis].", "Situation: [Meinungsverschiedenheit]. Aufgabe: [gemeinsames Ziel]. Handlung: Ich hörte zu und [echter Schritt]. Ergebnis: [was geschah].", "Situation: [Projekt und Termin]. Aufgabe: [Ihre Lieferung]. Handlung: Ich priorisierte und koordinierte [Beteiligte]. Ergebnis: [tatsächlicher Erfolg].", "Situation: [echter Fehler]. Aufgabe: [Ihre Rolle]. Handlung: Ich erkannte das Problem an und korrigierte [Punkt]. Ergebnis: Ich lernte [konkrete Erkenntnis].", "Situation: [Änderung]. Aufgabe: [Ziel sichern]. Handlung: Ich ordnete neu und informierte [Beteiligte]. Ergebnis: [tatsächliche Wirkung].", "Situation: [Teambedarf]. Aufgabe: [Idee vorschlagen]. Handlung: Ich zeigte [Belege] und bat um Rückmeldung. Ergebnis: [Entscheidung oder Erkenntnis]."],
    },
    management: {
      questions: ["Wie priorisieren Sie konkurrierende Aufgaben Ihres Teams?", "Wie unterstützen Sie ein Teammitglied mit Schwierigkeiten?", "Wie messen Sie den Erfolg eines Teams?", "Wie gehen Sie mit Uneinigkeit bei wichtigen Entscheidungen um?", "Wie verteilen Sie klare Verantwortlichkeiten?", "Wie balancieren Sie Teamziele und Stakeholder-Bedarf?"],
      reasons: ["Entscheidungen und Ressourcenplanung verstehen.", "Coaching und Kommunikation einschätzen.", "Leistung mit beobachtbaren Ergebnissen verbinden.", "Entscheidungsmoderation erkunden.", "Delegation und Verantwortung verstehen.", "Erwartungsmanagement beurteilen."],
      tips: ["Berücksichtigen Sie Wirkung, Termine, Abhängigkeiten und Kapazität.", "Beschreiben Sie ein unterstützendes Gespräch und klare Nachverfolgung.", "Wählen Sie Kennzahlen für Ziele und Qualität.", "Erklären Sie Zuhören, Optionen und Entscheidungskriterien.", "Klären Sie Ergebnisse, Befugnisse und Prüfpunkte.", "Nennen Sie frühe Kommunikation und Abwägungen."],
      answers: ["Ich priorisiere nach Wirkung, Termin, Abhängigkeiten und Kapazität. Abwägungen mache ich sichtbar und passe den Umfang bei Bedarf an. Echtes Beispiel: [Vorgehen und Ergebnis].", "Ich kläre zunächst Hindernis und Erwartungen, vereinbare dann praktische Schritte und Gespräche und verbinde Unterstützung mit klarer Verantwortung.", "Ich verbinde Kennzahlen mit Teamzielen, etwa [Qualität, Lieferung oder Nutzer], und berücksichtige Zusammenarbeit und Nachhaltigkeit.", "Ich sammle Sichtweisen und Fakten, kläre Risiken und Kriterien und halte Verantwortung und nächsten Prüftermin fest.", "Ich kläre Ergebnis, Entscheidungsspielraum und Check-ins, ermögliche Eigenständigkeit und bleibe ansprechbar.", "Ich kläre Ziele und Grenzen, erläutere Abwägungen und stimme Zeitplan und Updates ab."],
    },
  },
};

const DOMAIN_COPY: Record<InterviewLanguage, {
  star: string;
  category: Record<InterviewType, string>;
  easy: string;
  medium: string;
  hard: string;
  level: Record<ExperienceLevel, string>;
  company: string;
  role: string;
  industry: string;
  skills: string;
  relevant: string;
  years: string;
  description: string;
  unknown: string;
  questionsToAsk: string[];
  before: string[];
}> = {
  ar: {
    star: "استخدم طريقة STAR: الموقف الذي واجهته، المهمة أو مسؤوليتك، الإجراء الذي اتخذته أنت، والنتيجة الحقيقية أو ما تعلمته. لا تخترع نتيجة إذا لم تكن لديك.",
    category: { general: "عامة", technical: "تقنية", hr: "موارد بشرية", behavioral: "سلوكية", management: "إدارية" },
    easy: "سهل", medium: "متوسط", hard: "صعب",
    level: { beginner: "مبتدئ", intermediate: "متوسط", senior: "محترف / Senior" },
    company: "جهة العمل", role: "الوظيفة", industry: "المجال", skills: "المهارات أو الكلمات المرتبطة بالإعلان", relevant: "مهارات مرتبطة بالدور", years: "سنوات الخبرة",
    description: "متطلبات بارزة في وصف الوظيفة", unknown: "غير محدد",
    questionsToAsk: ["كيف يبدو النجاح في هذا الدور خلال أول 90 يومًا؟", "ما أهم التحديات التي يواجهها الفريق حاليًا؟", "كيف يتعاون هذا الفريق مع الفرق الأخرى؟", "ما فرص التعلم والتطور المرتبطة بهذا الدور؟", "ما الخطوات التالية في عملية التوظيف؟"],
    before: ["اقرأ عن الشركة ومنتجاتها أو خدماتها من مصادر موثوقة.", "راجع وصف الوظيفة وحدد المتطلبات الأقرب لخبرتك.", "حضّر أمثلة حقيقية توضّح مساهمتك ونتائجها.", "تدرّب بصوت عالٍ، واترك مساحة طبيعية للحوار.", "جهّز أسئلة مناسبة لطرحها في نهاية المقابلة."],
  },
  en: {
    star: "Use STAR: Situation (context), Task (your responsibility), Action (what you did), and Result (what actually happened or what you learned). Do not invent an outcome.",
    category: { general: "General", technical: "Technical", hr: "Human resources", behavioral: "Behavioral", management: "Management" },
    easy: "Easy", medium: "Medium", hard: "Hard",
    level: { beginner: "Beginner", intermediate: "Intermediate", senior: "Professional / Senior" },
    company: "the organization", role: "Role", industry: "Industry", skills: "Relevant skills or posting terms", relevant: "role-relevant skills", years: "Years of experience", description: "Notable job-posting requirements", unknown: "Not specified",
    questionsToAsk: ["What would success in this role look like in the first 90 days?", "What are the team's most important current challenges?", "How does this team work with other groups?", "What learning and development opportunities come with the role?", "What are the next steps in the hiring process?"],
    before: ["Research the company and its products or services using reliable sources.", "Review the job posting and identify requirements that match your experience.", "Prepare genuine examples that show your contribution and results.", "Practice aloud while leaving room for a natural conversation.", "Prepare a few relevant questions for the end of the interview."],
  },
  fr: {
    star: "Utilisez STAR : Situation (contexte), Tâche (responsabilité), Action (vos actions) et Résultat (résultat réel ou apprentissage). N’inventez pas de résultat.",
    category: { general: "Générale", technical: "Technique", hr: "Ressources humaines", behavioral: "Comportementale", management: "Management" },
    easy: "Facile", medium: "Moyen", hard: "Difficile",
    level: { beginner: "Débutant", intermediate: "Intermédiaire", senior: "Professionnel / Senior" },
    company: "l’entreprise", role: "Poste", industry: "Secteur", skills: "Compétences ou termes de l’offre", relevant: "compétences pertinentes pour le poste", years: "Expérience", description: "Exigences notables de l’offre", unknown: "Non précisé",
    questionsToAsk: ["À quoi ressemblerait la réussite durant les 90 premiers jours ?", "Quels sont les principaux défis actuels de l’équipe ?", "Comment l’équipe collabore-t-elle avec les autres services ?", "Quelles sont les possibilités d’apprentissage et d’évolution ?", "Quelles sont les prochaines étapes du recrutement ?"],
    before: ["Renseignez-vous sur l’entreprise et ses activités avec des sources fiables.", "Relisez l’annonce et repérez les exigences liées à votre expérience.", "Préparez des exemples authentiques de votre contribution.", "Entraînez-vous à voix haute sans réciter mécaniquement.", "Préparez quelques questions pertinentes pour la fin."],
  },
  es: {
    star: "Use STAR: Situación (contexto), Tarea (responsabilidad), Acción (lo que hizo) y Resultado (resultado real o aprendizaje). No invente resultados.",
    category: { general: "General", technical: "Técnica", hr: "Recursos humanos", behavioral: "Conductual", management: "Gestión" },
    easy: "Fácil", medium: "Medio", hard: "Difícil",
    level: { beginner: "Principiante", intermediate: "Intermedio", senior: "Profesional / Senior" },
    company: "la organización", role: "Puesto", industry: "Sector", skills: "Habilidades o términos relevantes", relevant: "habilidades relevantes para el puesto", years: "Experiencia", description: "Requisitos destacados del anuncio", unknown: "No especificado",
    questionsToAsk: ["¿Cómo sería el éxito en este puesto durante los primeros 90 días?", "¿Cuáles son los principales retos actuales del equipo?", "¿Cómo colabora este equipo con otros departamentos?", "¿Qué oportunidades de aprendizaje y desarrollo ofrece el puesto?", "¿Cuáles son los próximos pasos del proceso de selección?"],
    before: ["Investigue la empresa y sus productos o servicios con fuentes fiables.", "Revise el anuncio e identifique requisitos relacionados con su experiencia.", "Prepare ejemplos reales de su contribución y resultados.", "Practique en voz alta sin memorizar respuestas rígidas.", "Prepare preguntas pertinentes para el final de la entrevista."],
  },
  de: {
    star: "Nutzen Sie STAR: Situation (Kontext), Aufgabe (Verantwortung), Handlung (Ihr Vorgehen) und Ergebnis (tatsächliches Ergebnis oder Erkenntnis). Erfinden Sie kein Ergebnis.",
    category: { general: "Allgemein", technical: "Technisch", hr: "Personal", behavioral: "Verhalten", management: "Management" },
    easy: "Einfach", medium: "Mittel", hard: "Schwierig",
    level: { beginner: "Einsteiger", intermediate: "Mittelstufe", senior: "Professionell / Senior" },
    company: "das Unternehmen", role: "Position", industry: "Branche", skills: "Relevante Fähigkeiten oder Begriffe", relevant: "rollenrelevante Fähigkeiten", years: "Erfahrung", description: "Wichtige Anforderungen aus der Anzeige", unknown: "Nicht angegeben",
    questionsToAsk: ["Woran würde man den Erfolg in den ersten 90 Tagen erkennen?", "Was sind derzeit die wichtigsten Herausforderungen des Teams?", "Wie arbeitet das Team mit anderen Bereichen zusammen?", "Welche Lern- und Entwicklungsmöglichkeiten bietet die Rolle?", "Wie sehen die nächsten Schritte im Bewerbungsprozess aus?"],
    before: ["Informieren Sie sich mit zuverlässigen Quellen über das Unternehmen.", "Prüfen Sie die Anzeige und markieren Sie passende Anforderungen.", "Bereiten Sie echte Beispiele für Ihren Beitrag und Ergebnisse vor.", "Üben Sie laut, ohne Antworten auswendig aufzusagen.", "Bereiten Sie passende Fragen für das Gesprächsende vor."],
  },
};

const FOLLOW_UP_FOCUS: Record<InterviewLanguage, string[]> = {
  ar: ["مع ذكر مثال عملي وطريقة التحقق من النتيجة.", "مع توضيح البدائل والمفاضلة بينها.", "مع شرح ما ستقيسه لتقييم النجاح."],
  en: ["including a practical example and how you verified the outcome.", "explaining the alternatives and trade-offs you considered.", "describing what you would measure to evaluate success."],
  fr: ["avec un exemple concret et la manière de vérifier le résultat.", "en expliquant les options et les compromis envisagés.", "en précisant les indicateurs utilisés pour évaluer la réussite."],
  es: ["con un ejemplo práctico y cómo verificó el resultado.", "explicando las alternativas y los compromisos considerados.", "indicando qué mediría para evaluar el éxito."],
  de: ["mit einem praktischen Beispiel und der Prüfung des Ergebnisses.", "mit einer Erklärung der Alternativen und Abwägungen.", "mit den Messgrößen zur Bewertung des Erfolgs."],
};

const TECH_TRACKS: Array<{ matches: string[]; topics: Record<InterviewLanguage, string[]> }> = [
  { matches: ["frontend", "front-end", "react", "javascript", "مطور واجهات", "فرونت"], topics: {
    ar: ["JavaScript ووضوح تدفق التنفيذ", "React وإدارة حالة الواجهة", "التعامل مع APIs وحالات التحميل والأخطاء", "أداء الصفحة وتقليل إعادة الرسم", "CSS والتصميم المتجاوب وإمكانية الوصول"],
    en: ["JavaScript execution and asynchronous behavior", "React state and component design", "API integration and loading/error states", "Page performance and rendering", "Responsive CSS and accessibility"],
    fr: ["JavaScript et exécution asynchrone", "État React et composants", "Intégration d’API et erreurs", "Performances et rendu", "CSS responsive et accessibilité"],
    es: ["JavaScript y ejecución asíncrona", "Estado y componentes de React", "Integración de API y errores", "Rendimiento y renderizado", "CSS adaptable y accesibilidad"],
    de: ["JavaScript und asynchrone Abläufe", "React-Zustand und Komponenten", "API-Integration und Fehler", "Performance und Rendering", "Responsives CSS und Barrierefreiheit"],
  } },
  { matches: ["marketing", "seo", "google ads", "ppc", "digital", "تسويق", "إعلانات"], topics: {
    ar: ["تحسين محركات البحث SEO وقياس الظهور العضوي", "Google Ads واستهداف الحملات", "ROAS والميزانية والعائد على الإنفاق", "Analytics وإسناد التحويلات", "معدل التحويل وتجارب التحسين"],
    en: ["SEO and measuring organic visibility", "Google Ads targeting and campaign structure", "ROAS, budgets, and return on ad spend", "Analytics and conversion attribution", "Conversion rate testing and optimization"],
    fr: ["SEO et visibilité organique", "Ciblage Google Ads", "ROAS, budgets et rentabilité", "Analytics et attribution", "Tests et optimisation de conversion"],
    es: ["SEO y visibilidad orgánica", "Segmentación de Google Ads", "ROAS, presupuestos y rentabilidad", "Analítica y atribución", "Pruebas y optimización de conversión"],
    de: ["SEO und organische Sichtbarkeit", "Google-Ads-Targeting", "ROAS, Budget und Rentabilität", "Analytics und Attribution", "Conversion-Tests und Optimierung"],
  } },
  { matches: ["data", "analyst", "sql", "scientist", "بيانات", "تحليل"], topics: {
    ar: ["استعلامات SQL والتحقق من جودة البيانات", "اختيار المقاييس وبناء تعريف موحد لها", "تحليل الاتجاهات والتمييز بين الارتباط والسببية", "عرض النتائج باستخدام تصور مناسب", "التعامل مع البيانات الناقصة أو المتحيزة"],
    en: ["SQL queries and data-quality checks", "Metric selection and consistent definitions", "Trend analysis versus causal inference", "Choosing a clear data visualization", "Handling missing or biased data"],
    fr: ["Requêtes SQL et qualité des données", "Choix et définition des indicateurs", "Tendances et causalité", "Visualisation des résultats", "Données manquantes ou biaisées"],
    es: ["Consultas SQL y calidad de datos", "Selección y definición de métricas", "Tendencias y causalidad", "Visualización clara de resultados", "Datos faltantes o sesgados"],
    de: ["SQL-Abfragen und Datenqualität", "Auswahl und Definition von Kennzahlen", "Trends und Kausalität", "Klare Datenvisualisierung", "Fehlende oder verzerrte Daten"],
  } },
  { matches: ["design", "designer", "ux", "ui", "graphic", "تصميم", "مصمم"], topics: {
    ar: ["بحث المستخدمين والتحقق من الاحتياج", "بناء تدفق استخدام واضح", "اختبار قابلية الاستخدام وتحليل الملاحظات", "نظام التصميم واتساق المكونات", "موازنة احتياجات المستخدم والقيود التقنية"],
    en: ["User research and validating needs", "Designing a clear user flow", "Usability testing and synthesizing feedback", "Design systems and component consistency", "Balancing user needs and technical constraints"],
    fr: ["Recherche utilisateur et validation des besoins", "Parcours utilisateur clair", "Tests d’utilisabilité et retours", "Systèmes de design et cohérence", "Besoins utilisateurs et contraintes techniques"],
    es: ["Investigación y validación de necesidades", "Flujos de usuario claros", "Pruebas de usabilidad y comentarios", "Sistemas de diseño y coherencia", "Necesidades y restricciones técnicas"],
    de: ["Nutzerforschung und Bedarfsvalidierung", "Klare Nutzerabläufe", "Usability-Tests und Feedback", "Designsysteme und Konsistenz", "Nutzerbedarf und technische Grenzen"],
  } },
  { matches: ["product", "product manager", "منتج", "إدارة المنتجات"], topics: {
    ar: ["ترتيب خارطة الطريق بناءً على الأثر", "صياغة متطلبات قابلة للاختبار", "موازنة احتياجات العملاء والجهد التقني", "اختيار مؤشرات نجاح المنتج", "تنسيق الإطلاق مع أصحاب المصلحة"],
    en: ["Prioritizing a roadmap by impact", "Writing testable product requirements", "Balancing user needs and technical effort", "Selecting product success metrics", "Coordinating launches with stakeholders"],
    fr: ["Priorisation de la feuille de route", "Exigences produit vérifiables", "Besoins utilisateurs et effort technique", "Indicateurs de succès produit", "Coordination du lancement"],
    es: ["Priorización de la hoja de ruta", "Requisitos de producto verificables", "Necesidades y esfuerzo técnico", "Métricas de éxito del producto", "Coordinación de lanzamientos"],
    de: ["Priorisierung einer Roadmap", "Prüfbare Produktanforderungen", "Nutzerbedarf und Technikaufwand", "Produktkennzahlen", "Abstimmung von Markteinführungen"],
  } },
  { matches: ["software", "engineer", "developer", "backend", "full stack", "مهندس", "مطور"], topics: {
    ar: ["تصميم واجهات APIs واضحة", "اختبارات الوحدات والتكامل", "قواعد البيانات والفهارس والأداء", "الأمان والتحقق من المدخلات", "مراقبة الأخطاء وموثوقية الخدمة"],
    en: ["Designing clear API contracts", "Unit and integration testing", "Database indexes and performance", "Security and input validation", "Error monitoring and service reliability"],
    fr: ["Contrats d’API clairs", "Tests unitaires et d’intégration", "Index et performances des bases de données", "Sécurité et validation des entrées", "Suivi des erreurs et fiabilité"],
    es: ["Contratos de API claros", "Pruebas unitarias y de integración", "Índices y rendimiento de bases de datos", "Seguridad y validación de entradas", "Supervisión de errores y fiabilidad"],
    de: ["Klare API-Verträge", "Unit- und Integrationstests", "Datenbankindizes und Performance", "Sicherheit und Eingabevalidierung", "Fehlerüberwachung und Zuverlässigkeit"],
  } },
];

function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] || values.role);
}

export function createInterviewQuestions(input: InterviewInput, variation = 0): InterviewQuestion[] {
  const langCopy = DOMAIN_COPY[input.language];
  const selectedTypes: InterviewType[] = input.types.length ? input.types : ["general"];
  const role = input.jobTitle.trim() || langCopy.unknown;
  const company = input.company.trim() || langCopy.company;
  const domain = input.industry.trim() || input.jobTitle.trim() || langCopy.role;
  const keywords = extractInterviewKeywords(input.jobDescription);
  const matchedKeywords = keywords.filter((term) => input.jobTitle.toLocaleLowerCase().includes(term.toLocaleLowerCase()) || input.industry.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
  const skillTerms = [...new Set([...matchedKeywords, ...keywords].slice(0, 4))];
  const values = {
    role,
    company,
    domain,
    skills: skillTerms.join(input.language === "ar" ? "، " : ", ") || langCopy.relevant,
    keywords: keywords.slice(0, 4).join(input.language === "ar" ? "، " : ", ") || langCopy.relevant,
    years: input.yearsExperience.trim() ? ` (${langCopy.years}: ${input.yearsExperience.trim()})` : "",
  };

  const buckets: InterviewQuestion[][] = selectedTypes.map((type) => {
    const category = COPY[input.language][type];
    const track = type === "technical"
      ? TECH_TRACKS.find((item) => item.matches.some((term) => `${input.jobTitle} ${input.industry} ${input.jobDescription}`.toLocaleLowerCase().includes(term)))
      : undefined;
    const candidates: InterviewQuestion[] = [];
    for (let index = 0; index < input.count; index += 1) {
      const questionIndex = (index + variation) % category.questions.length;
      const customQuestion = type === "technical" && track
        ? `${input.language === "ar" ? "كيف ستتعامل عمليًا مع" : input.language === "fr" ? "Comment aborderiez-vous" : input.language === "es" ? "¿Cómo abordaría" : input.language === "de" ? "Wie würden Sie praktisch mit" : "How would you approach"} ${track.topics[input.language][(index + variation) % track.topics[input.language].length]}${input.language === "ar" ? "؟" : "?"}`
        : interpolate(category.questions[questionIndex], values);
      const questionCycle = Math.floor(index / (type === "technical" && track ? track.topics[input.language].length : category.questions.length));
      const question = questionCycle === 0
        ? customQuestion
        : `${customQuestion} ${FOLLOW_UP_FOCUS[input.language][(questionCycle - 1) % FOLLOW_UP_FOCUS[input.language].length]}`;
      const difficultyKey = input.harder
        ? (index % 2 === 0 ? "hard" : "medium")
        : input.level === "beginner"
          ? (index % 3 === 0 ? "easy" : "medium")
          : input.level === "senior"
            ? (index % 3 === 0 ? "hard" : "medium")
            : (index % 3 === 0 ? "easy" : index % 3 === 1 ? "medium" : "hard");
      const difficulty = difficultyKey === "easy" ? langCopy.easy : difficultyKey === "hard" ? langCopy.hard : langCopy.medium;
      candidates.push({
        id: `${type}-${index}`,
        type,
        question,
        why: interpolate(category.reasons[questionIndex], values),
        answer: interpolate(category.answers[questionIndex], values),
        tip: category.tips[questionIndex],
        difficulty: difficulty as InterviewQuestion["difficulty"],
        isStar: type === "behavioral",
      });
    }
    return candidates;
  });
  const questions: InterviewQuestion[] = [];
  for (let index = 0; index < input.count; index += 1) {
    for (const bucket of buckets) {
      const question = bucket[index];
      if (question) questions.push(question);
      if (questions.length === input.count) break;
    }
    if (questions.length === input.count) break;
  }
  return questions.map((question, index) => ({ ...question, id: `${question.type}-${index}` }));
}

export function getInterviewSupportingContent(language: InterviewLanguage) {
  return DOMAIN_COPY[language];
}
