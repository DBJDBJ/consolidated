namespace Tests;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Minimal_API;
using System;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Xunit;

using static test_context;
class test_context
{
    readonly public static string db_name = "inmemorytestdb";

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static string whoami([CallerMemberName] string caller_name = null)
    {
        if (string.IsNullOrEmpty(caller_name))
            return "unknown";
        if (string.IsNullOrWhiteSpace(caller_name))
            return "unknown";
        return caller_name;
    }

    static Lazy<ApiContext> lazy_context = new Lazy<ApiContext>(() =>
    {
        var options = new DbContextOptionsBuilder<ApiContext>()
       .UseInMemoryDatabase(databaseName: db_name)
       .Options;
        return new ApiContext(options);
    });

    public static ApiContext ctx { get { return lazy_context.Value; } }

    static Lazy<ArticleService> lazy_client = new Lazy<ArticleService>(() =>
    {
        return new ArticleService(ctx);
    });

    public static ArticleService client { get { return lazy_client.Value; } }
}


public class MinimalAPITest
{
    [Fact]
    public async Task create_article()
    {
        // Microsoft.AspNetCore.Http.IResult { Microsoft.AspNetCore.Http.Result.CreatedResult}
        var rez
            = await test_context.client.create_article(new ArticleRequest(whoami(), "content", DateTime.Now));
        Assert.NotNull(rez);
    }

    [Fact]
    public async Task all_articles()
    {
        //        Microsoft.AspNetCore.Http.IResult { Microsoft.AspNetCore.Http.Result.OkObjectResult}
        var rez = await test_context.client.all_articles();
        Assert.NotNull(rez);
    }

    /*
     Low Level test are not using the top level 
     */
    [Fact]
    public async Task ArticleIsCreatedSuccessfully()
    {
        var articleRequest = new ArticleRequest(whoami(), "Content", null);
        // When
        await test_context.client.create_article(articleRequest);
        // Then
        Assert.True(await test_context.client._context.Articles.FirstOrDefaultAsync() != null);
    }

    [Fact]
    public async Task ArticleIsUpdatedSuccessfully()
    {
        var articleRequest = new ArticleRequest(whoami(), "Content", null);

        await test_context.client.update_article(1, articleRequest);

        var updatedArticle = await test_context.ctx.Articles.FindAsync(1);

        Assert.Equal(whoami(), updatedArticle!.Title);
    }

    [Fact]
    public async Task ArticleIsDeletedSuccessfully()
    {
        var apiContext = test_context.ctx ;

        var ef_entity = apiContext.Articles.Add(
            new Article { Title = whoami(), Content = "Content" }
            );
        apiContext.SaveChanges();

        Article art_ = ef_entity.Entity as Article;

        await (new ArticleService(apiContext)).delete_article(art_.Id);

        var deletedArticle = await apiContext.Articles.FindAsync(art_.Id); 

        Assert.Null(deletedArticle);
    }

    [Fact]
    public async Task ArticleIsGetSuccessfully()
    {
        var apiContext = test_context.ctx ;

        apiContext.Articles.Add(new Article { Title = whoami() /*"Title"*/, Content = "Content" + nameof(ArticleIsGetSuccessfully) });
        apiContext.SaveChanges();

        await (new ArticleService(apiContext)).all_articles();

        var existingArticle = await apiContext.Articles.FirstOrDefaultAsync();

        Assert.NotNull(existingArticle);
    }

}