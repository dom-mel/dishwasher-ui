jQuery(document).ready(function () {

    var base = "http://127.0.0.1:8000/";
    var $state = jQuery('#state');
    var $finishesAt = jQuery('#remaining');
    var $door = jQuery('#door');
    var $errorUnable = jQuery('#error-unable');
    var $errorOffline = jQuery('#error-offline');

    jQuery('button').click(function () {
        var data = {};
        var state = jQuery(this).data('state');
        var door = jQuery(this).data('door');
        if (state) {
            data.state = state;
        }
        if (door) {
            data.door_open = door === 'open';
        }

        jQuery.ajax(
            base + "dishwasher",
            {
                data: JSON.stringify(data),
                method: 'PATCH',
                dataType: 'json',
                success: function (data) {
                    $errorUnable.hide();
                },
                error: function () {
                    $errorUnable.show();
                }
            }
        )
    });

    function update() {
        jQuery.ajax(
            base + "dishwasher",
            {
                dataType: 'json',
                success: function (data) {
                    $state.text(data.state);
                    if (data.finishes_at === 0 ) {
                        $finishesAt.text(0);
                    } else {
                        $finishesAt.text(
                            Math.round(data.finishes_at - new Date().getTime()/1000)
                        );
                    }
                    $door.text(data.door_open ? "opened" : "closed");
                    $errorOffline.hide();
                },
                error: function () {
                    $state.text('Unknown');
                    $finishesAt.text('Unknown');
                    $errorOffline.show();
                }
            }
        )
    }

    setInterval(update, 500);
});
