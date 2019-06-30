$( document ).ready(function() {
    $(document).on('click','[for="toggle-heart"]',function(e){
        var NoOfFavouritesSpan=$(this).closest('.post-status').find('.no-of-favourites');
        var NoOfFavourites=NoOfFavouritesSpan.data('no-of-favourites');

        if($(this).hasClass("heart-checked")) {
            $(this).removeClass('heart-checked');
            NoOfFavouritesSpan.data('no-of-favourites',NoOfFavourites-1)
            NoOfFavouritesSpan.html(NoOfFavourites-1)
        }
        else{
            $(this).addClass('heart-checked');
            NoOfFavouritesSpan.data('no-of-favourites',NoOfFavourites+1)
            NoOfFavouritesSpan.html(NoOfFavourites+1)
        }
        //ajax call
        var StatusId=$(this).closest('.post-status').data('status-id');
        var PostUrl="/favourites/"+StatusId+"/";
        $.ajax({
            url:PostUrl,
            type: 'POST',
            data:{}      
        })

    })
});
