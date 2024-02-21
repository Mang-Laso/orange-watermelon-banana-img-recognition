$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#result').hide();

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
    });

    // Predict
    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);

        // Show loading animation
        $(this).hide();
        $('.loader').show();

        // Make prediction by calling api /predict
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                // Hide loader
                $('.loader').hide();
                
                // Check if probability is less than 0.80
                if (parseFloat(data.probability) < 0.70) {
                    $('#predicted-class').text("The picture is not a watermelon, banana, or an orange.");
                    $('#probability').text("");
                } else {
                    // Update predicted class and probability in HTML
                    $('#predicted-class').text(data.predicted_class);
                    $('#probability').text(data.probability);
                }
                
                // Show result section
                $('#result').fadeIn(600);

                // Update validation metrics
                $('#precision').text("Precision: " + data.precision);
                $('#recall').text("Recall: " + data.recall);
                $('#f1-score').text("F1 Score: " + data.f1_score);
                
                // Convert confusion matrix array to string for display
                var confMatrixStr = "";
                for (var i = 0; i < data.confusion_matrix.length; i++) {
                    confMatrixStr += data.confusion_matrix[i].join(" ") + "<br>";
                }
                $('#confusion-matrix').html("Confusion Matrix: <br>" + confMatrixStr);
            },
            error: function (xhr, status, error) {
                // Hide loader and show error message
                $('.loader').hide();
                $('#result').text('An error occurred: ' + error);
                $('#result').fadeIn(600);
            }
        });
    });
});
