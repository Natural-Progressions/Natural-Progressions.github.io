$(function () {
    $("#containerDiv").prepend(`<nav class="navbar navbar-expand-lg bg-body-tertiary mb-5 sticky-top">
    <div class="container-fluid">
        <a class="navbar-brand" href="/index.html">Home</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Core Rules</a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="/core_rules.html">Assumptions and Terminology</a></li>
                        <li><a class="dropdown-item" href="/skills.html">Skills</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>`);
});