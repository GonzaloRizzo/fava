$(document).ready(function() {
    var defaultOptions = {
        theme: "ace/theme/chrome",
        mode: "ace/mode/beancount",
        wrap: true,
        printMargin: false,
        fontSize: "13px",
        fontFamily: "monospace",
        useSoftTabs: true,
        showFoldWidgets: false
    };

    // Read-only editors
    $('.editor-wrapper .editor.editor-readonly').each(function() {
        var editorId = $(this).prop('id');
        var editor = ace.edit(editorId);
        editor.setOptions(defaultOptions);
        editor.setOptions({
            maxLines: editor.session.getLength(),
            readOnly: true,
            highlightActiveLine: false,
            highlightGutterLine: false
        });

        editor.renderer.$cursorLayer.element.style.opacity=0;
    });

    // The /source/ editor
    if ($('#editor-source').length) {
        var editorHeight = $('.main').height() - 60;
        $('.editor-wrapper').height(editorHeight);

        var editor = ace.edit("editor-source");
        editor.setOptions(defaultOptions);
        editor.focus();

        $.hlLine = $.urlParam('line');
        $('form.editor-source select[name="file_path"]').change(function(event) {
            event.preventDefault();
            var $this = $(this);
            $.filePath = $(this).val();
            $.get($(this).parents('form').attr('action'), { file_path: $(this).val(), is_ajax: true } )
            .done(function(data) {
                editor.setValue(data, -1);
                editor.gotoLine($.hlLine, 1, true);
                if ($.filePath != $.urlParam('file_path')) {
                    $.hlLine = 1;
                }
            });
        });

        $('form.editor-source select[name="file_path"]').change();

        $('form.editor-save input[type="submit"]').click(function(event) {
            event.preventDefault();
            var $this = $(this);
            var fileName = $('form.editor-source select').val();

            $.post($(this).parents('form').attr('action'), { file_path: fileName, source: editor.getValue() } )
            .done(function(data) {
                if (data == "True") {
                    alert("Successfully saved to\n\n\t" + fileName + "\n\nReloading files...");
                    location.reload();
                } else {
                    alert("Writing to\n\n\t" + fileName + "\n\nwas not successful.");
                }
            });
        });
    }
});