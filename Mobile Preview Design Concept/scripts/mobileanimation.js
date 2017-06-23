$('.feature-item').click(function() {
  if ($(window).width() < 867)
    return false;

  var selectedFeatureItem = $('.feature-item.selected');
  var selectedFeatureItemPreview = selectedFeatureItem.find('.device-holder-inner');

  if ($(this).hasClass('selected'))
    return false;

  $(this).addClass('selected');
  $(this).find('.device-holder-inner').removeClass('device-preview-animating');

  selectedFeatureItemPreview.addClass('device-preview-animating');
  selectedFeatureItem.removeClass('selected');

  selectedFeatureItem.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
    function(e) {
      selectedFeatureItemPreview.removeClass('device-preview-animating');
    });
});