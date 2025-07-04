using MailKit.Security;
using MailKit.Net.Smtp;
using MimeKit;

namespace pj_ds_KomirkaApp_API
{


    // currently not in use whatsoever

    public interface IEmailSender
    {
        Task SendAsync(string to, string subject, string htmlBody);
    }

    public sealed class SmtpEmailSender : IEmailSender
    {
        private readonly IConfiguration _cfg;      
        public SmtpEmailSender(IConfiguration cfg) => _cfg = cfg;

        public async Task SendAsync(string to, string subject, string htmlBody)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_cfg["Smtp:From"]));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart("html") { Text = htmlBody };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_cfg["Smtp:Host"],
                                    int.Parse(_cfg["Smtp:Port"]),
                                    SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_cfg["Smtp:User"], _cfg["Smtp:Pass"]);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
