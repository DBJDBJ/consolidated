namespace MinKestrel;

public interface IArticleService
{
    Task<IResult> all_articles();

    Task<IResult> get_article_by_id(int id);

    Task<IResult> create_article(ArticleRequest article);

    Task<IResult> update_article(int id, ArticleRequest article);

    Task<IResult> delete_article(int id);
}
