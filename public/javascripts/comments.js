$(document).ready(function(){
    $('.add-comment-button').addClass('disabled');
    $('.add-comment-box').keyup(function(){
        if($(this).val().length !=0)
            $(this).closest('.post-status').find('.add-comment-button').removeClass('disabled');            
        else
            $(this).closest('.post-status').find('.add-comment-button').addClass('disabled');            
    })

   
});

$(document).on('click','.show-comments',function(e){
    var comment_section =$(this).closest('.post-status').find('.comments-section'); 
    if(comment_section.hasClass('hidden')){
        comment_section.removeClass('hidden');
    }
    else{
        comment_section.addClass('hidden');
    }
})



$(document).on('click','.add-comment-button',function(e){
    var comment =$(this).closest('.post-status').find('.add-comment-box').val();
    $(this).closest('.post-status').find('.add-comment-box').val('');
    var StatusId=$(this).closest('.post-status').data('status-id');
    var TotalCommentsLocation=$(this).closest('.post-status').find('.total-comments');
    var TotalComments=TotalCommentsLocation.data('total-comments');
    var TagetLocation=$(this).closest('.post-status').find('.all-comments');
    var PostUrl="/status/"+StatusId+"/comment";
    $.ajax({
            url:PostUrl,
            type: 'POST',
            data:{
                comment:comment
            },
            success: function(data) {
                TagetLocation.append(data);
                TotalCommentsLocation.data("total-comments",TotalComments+1);
                TotalCommentsLocation.html(TotalComments+1);

            }    
    })

})
