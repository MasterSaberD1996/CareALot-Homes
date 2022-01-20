import {Injectable} from "@angular/core";
import {IErrorMessage} from "./error-message.model";

@Injectable({
  providedIn: "root"
})
export class ErrorMessageConfigService {
  public static readonly DO_NOT_SHOW_ANY_ERROR_MESSAGE: string = "Let the field be invalid, but don’t show any error message";

  public readonly name: IErrorMessage = {
    required: "Please enter your name"
  }

  public readonly email: IErrorMessage = {
    required: "Please enter your email",
    email: "Please enter a valid email"
  }

  public readonly message: IErrorMessage = {
    required: "Please enter your question or request"
  }

  public readonly phone: IErrorMessage = {
    required: "Please enter your phone number",
    minlength: "Please enter your full phone number",
    invalidStart: "Please do not include the country code in your phone number",
    notValidEntry: "Please enter your phone number without any special characters"
  }

  public readonly location: IErrorMessage = {
    required: "Please select a location"
  }
}
