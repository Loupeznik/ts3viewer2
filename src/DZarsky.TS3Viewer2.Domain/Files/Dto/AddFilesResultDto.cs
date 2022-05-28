namespace DZarsky.TS3Viewer2.Domain.Files.Dto
{
    public class AddFilesResultDto
    {
        public IList<string> Successful { get; set; } = new List<string>();

        public IList<string> Failed { get; set; } = new List<string>();
    }
}
