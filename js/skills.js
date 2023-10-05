async function redrawTOC() {

    await delay(200);
    /* Set the skip attribute on all items that normally would get picked up */
    $('#skills-tabContent').find('h1, h2').attr('data-toc-skip','');

    /* Remove the skil attribute from the items currently being shown */
    $('#skills-tabContent').find('.show').find('h1, h2').removeAttr('data-toc-skip','');

    /* Delete the existing table of contents */
    $("#toc").empty();

    /* Rerun the toc script, regenerating the table of contents */
    $.getScript( "/js/toc.js" );

    /* When run this way, the first object doesn't get set to active. Set it to active */
    $("#toc").find('a').first().addClass('active');
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}