$('#test').html('hello')

const description = `cloud architect and site reliability engineer with over a decade of intense professional experience strictly adhering to DevOps methodology. He has architected and built multiple platform-agnostic infrastructures from scratch for modern cloud systems`;

new TypeIt("#header-description", {
    strings: "",
    speed: 20,
    lifeLike: true,
    cursor: true,
    waitUntilVisible: true,
    afterComplete: async (step, instance) => {
        instance.destroy();
    }
})
.type(description, {delay: 1000})
.go();


