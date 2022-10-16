namespace MinKestrel;

public record ArticleRequest(string? Title, string? Content, DateTime? PublishedAt);