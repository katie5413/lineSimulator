const galleryItemTemplate = `<div class="galleryItem" data-id="{{id}}">
    <img class="img" src="{{img}}" alt="{{name}}" />
    <span class="name">{{name}}</span>
</div>`;

function generateGalleryItem(props) {
    let template = galleryItemTemplate;

    return generateHtml(template, {
        ...props,
    });
}
