const state = {
    currentPage: null,
    pages: [
        {
            index: 0,
            onAction: () => {
                setPage(1);
            }
        },
        {
            index: 6,
        },
        {
            index: 7,
        },
        {
            index: 1,
            type: 'page-quiz',
            step: 'Step 1 of 5',
            title: 'How Much Do You Need?',
            subTitle: `Tell Us How Much Money You'd Like To Borrow.`,
            questions: [
                { letter: 'A', text: `Less than $500` },
                { letter: 'B', text: `$1,000-$3,000` },
                { letter: 'C', text: `$3,000-$5,000` },
                { letter: 'D', text: `$5,000-$10,000` },
                { letter: 'E', text: `As Much As I Can Get` },
            ],
            answer: null,
        },
        {
            index: 2,
            type: 'page-quiz',
            step: 'Step 2 of 5',
            title: 'What Will You Use The Money For?',
            subTitle: `Tell Us What You Intend To Use The Money For If Approved.`,
            questions: [
                { letter: 'A', text: `Go Shopping` },
                { letter: 'B', text: `Pay For Late Bills` },
                { letter: 'C', text: `Pay For Food & Groceries` },
                { letter: 'D', text: `Pay For An Emergency` },
                { letter: 'E', text: `All The Above` },
            ],
            answer: null,
        },
        {
            index: 3,
            type: 'page-quiz',
            step: 'Step 3 of 5',
            title: 'What Is Your Credit Score?',
            subTitle: `This Will Help Us Connect You To The Lending Partner Whose Most Likely To Approve You.`,
            questions: [
                { letter: 'A', text: `Worse Than Bad` },
                { letter: 'B', text: `Average` },
                { letter: 'C', text: `Good` },
                { letter: 'D', text: `I Have No Credit History` },
            ],
            answer: null,
        },
        {
            index: 4,
            type: 'page-quiz',
            step: 'Step 4 of 5',
            title: 'What Is Your Approximate Annual Income?',
            subTitle: `Tell Us Approximately How Much You Earn Yearly (Before Tax).`,
            questions: [
                { letter: 'A', text: `$20,000 - $30,000` },
                { letter: 'B', text: `$40,000 - $50,000` },
                { letter: 'C', text: `$50,000+` },
                { letter: 'D', text: `I'm Unemployed` },
            ],
            answer: null,
        },
        {
            index: 5,
            type: 'page-quiz',
            step: 'Step 5 of 5',
            title: 'Do You Receive Any Monthly or Annual Financial Assistance From The Government?',
            subTitle: `This Will Help Us Further Connect You To The Best Lending Partner For You.`,
            questions: [
                { letter: 'A', text: `Yes` },
                { letter: 'B', text: `No` },
            ],
            answer: null,
        },

    ]
};
function bindData(template, prefix, o) {
    let html = template[0].outerHTML;
    for (prop of Object.keys(o)) {
        html = html.split(`{{${prefix}.${prop}}}`).join(o[prop]);
    }
    return $(html);
};
function setPage(index) {
    state.currentPage = state.pages.find(p => p.index === index);
    $('.page').children().hide();
    const name = state.currentPage.id;
    $(`.page-${index}`).show();

    if (state.currentPage.index === 6) {
        setTimeout(() => {
            setPage(state.currentPage.index + 1);
        }, 3000);
    }
    $("html, body").animate({ scrollTop: 0 }, "slow");
}
function hookupEvents() {
    $('.cookie-notification').find('button').click(() => {
        $('.cookie-notification').hide();
    });
    $('main button').click((e) => {
        const action = $(e.currentTarget).data().action;
        if (state.currentPage.onAction) {
            state.currentPage.onAction(action);
        }
    });
    $('.question').click((e) => {
        const answer = $(e.currentTarget).data().answer;
        state.currentPage.answer = answer;
        setPage(state.currentPage.index + 1);
    });
}
function buildQuiz() {
    const pageTemplate = $('#page-quiz-template');
    pageTemplate.attr('id', null);
    const questionTemplate = pageTemplate.find('.question');
    questionTemplate.remove();
    pageTemplate.remove();
    state.pages
        .filter(p => p.type === 'page-quiz')
        .forEach(p => {
            const newPage = bindData(pageTemplate, 'page', p);
            p.questions.forEach((q, i) => {
                const newQuestion = bindData(questionTemplate, 'question', q);
                newPage.append(newQuestion);
            });
            $('.page').append(newPage);
        });
}

buildQuiz();
hookupEvents();
setPage(0);