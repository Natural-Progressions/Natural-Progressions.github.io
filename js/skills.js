function redrawTOC() {
    /* Set the skip attribute on all items that normally would get picked up */
    $('#skills-tabContent').find('h1, h2').attr('data-toc-skip','');

    /* Remove the skil attribute from the items currently being shown */
    $('#skills-tabContent').find('.show').find('h1, h2').removeAttr('data-toc-skip','');

    $("#toc").empty();

    /* Rerun the toc script */
    $.getScript( "/js/toc.js" );
}